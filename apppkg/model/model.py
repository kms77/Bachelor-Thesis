import clip
import os
from torch import nn
import numpy as np
import torch
import torch.nn.functional as nnf
import sys
from typing import Tuple, List, Union, Optional
from transformers import GPT2Tokenizer, GPT2LMHeadModel, AdamW, get_linear_schedule_with_warmup
from tqdm import tqdm, trange
import skimage.io as io
import PIL.Image
from IPython.display import Image

N = type(None)  # N = NoneType(type of the None object - it indicates no value)
A = np.array  # array
# np.ndarray = associated data-type object describes the format of each element in the array
SA = np.ndarray  # single array
MSA = Union[Tuple[SA, ...], List[SA]]  # multiple single arrays
MA = Union[Tuple[A, ...], List[A]]  # multiple arrays
AN = Union[A, N]  # array U NoneType
MAN = Union[MA, N]  # multiple single arrays U NoneType
T = torch.Tensor  # a multi-dimensional matrix containing elements of a single data type
TM = Union[Tuple[T, ...], List[T]]  # multiple multi-dimensional matrices
TN = Optional[T]  # multi-dimensional matrix or NoneType
TNM = Union[Tuple[TN, ...], List[TN]]  # multi-dimensional matrices or NoneType
TMN = Optional[TM]  # multiple multi-dimensional matrices or NoneType
TSA = Union[T, SA]  # multi-dimensional matrix U single array

current_directory = os.getcwd()  # returns the absolute path of the working directory where Python is currently running
save_path = os.path.join(os.path.dirname(current_directory), "pretrained_models")
os.makedirs(save_path, exist_ok=True)
# os.path.join = returns a string which represents the concatenated path components
model_path = os.path.join(save_path, 'model_weights.pt')


class MLP(nn.Module):
    T = torch.Tensor

    def forward(self, x: T) -> T:
        return self.model(x)

    def __init__(self, sizes: Tuple[int, ...], bias=True, act=nn.Tanh):
        super(MLP, self).__init__()
        layers = []
        for i in range(len(sizes) - 1):
            #  nn.Linear = applies a linear transformation to the incoming data: y = xA^T + b
            layers.append(nn.Linear(sizes[i], sizes[i + 1], bias=bias))
            if i < len(sizes) - 2:
                # nn.Tanh = applies the Hyperbolic Tangent (Tanh) function element-wise
                layers.append(act())
        # nn.Sequential runs the all layers at once
        self.model = nn.Sequential(*layers)


class ClipCaptionModel(nn.Module):
    T = torch.Tensor

    def __init__(self, prefix_length: int, prefix_size: int = 512):
        super(ClipCaptionModel, self).__init__()
        self.prefix_length = prefix_length
        self.gpt = GPT2LMHeadModel.from_pretrained('gpt2')
        self.gpt_embedding_size = self.gpt.transformer.wte.weight.shape[1]
        if prefix_length > 10:
            self.clip_project = nn.Linear(prefix_size, self.gpt_embedding_size * prefix_length)
        else:
            self.clip_project = MLP(
                (prefix_size, (self.gpt_embedding_size * prefix_length) // 2, self.gpt_embedding_size * prefix_length))

    def get_dummy_token(self, batch_size: int) -> T:
        return torch.zeros(batch_size, self.prefix_length, dtype=torch.int64)

    def forward(self, tokens: T, prefix: T, mask: Optional[T] = None, labels: Optional[T] = None):
        # Generative Pre-trained Transformer 3 (GPT-3) is an autoregressive language model that uses deep learning
        # to produce human-like text
        # wte is a look-up table which holds all the vectors that correspond to the token value
        embedding_text = self.gpt.transformer.wte(tokens)
        prefix_projections = self.clip_project(prefix).view(-1, self.prefix_length, self.gpt_embedding_size)
        print(embedding_text.size())  # torch.Size([5, 67, 768])
        print(prefix_projections.size())  # torch.Size([5, 1, 768])
        embedding_cat = torch.cat((prefix_projections, embedding_text), dim=1)
        if labels is not None:
            dummy_token = self.get_dummy_token(tokens.shape[0])
            labels = torch.cat((dummy_token, tokens), dim=1)
        output = self.gpt(inputs_embeds=embedding_cat, labels=labels, attention_mask=mask)
        return output


class ClipCaptionPrefix(ClipCaptionModel):
    def parameters(self, recurse: bool = True):
        return self.clip_project.parameters()

    def train(self, mode: bool = True):
        super(ClipCaptionPrefix, self).train(mode)  # train the model
        self.gpt.eval()  # turn on the evaluation mode on the model
        return self


def generate_beam(model, tokenizer, beam_size: int = 5, prompt=None, embed=None, entry_length=67,
                  temperature=1., stop_token: str = '.'):
    model.eval()
    stop_token_index = tokenizer.encode(stop_token[0])
    tokens = None
    scores = None
    device = next(model.parameters()).device  # we do not have used the device
    seq_lengths = torch.ones(beam_size, device=device)
    is_stopped = torch.zeros(beam_size, device=device, dtype=torch.bool)
    with torch.no_grad():
        if embed is not None:
            generated = embed
        else:
            if tokens is None:
                tokens = torch.tensor(tokenizer.encode(prompt))
                tokens = tokens.unsqueeze(0).to(device)
                generated = model.gpt.transformer.wte(tokens)
        for i in range(entry_length):
            outputs = model.gpt(inputs_embeds=generated)
            logits = outputs.logits
            logits = logits[:, -1, :] / (temperature if temperature > 0 else 1.0)
            logits = logits.softmax(-1).log()
            if scores is None:
                scores, next_tokens = logits.topk(beam_size)
                generated = generated.expand(beam_size, *generated.shape[1:])
                next_tokens, scores = next_tokens.permute(1, 0), scores.squeeze(0)
                if tokens is None:
                    tokens = next_tokens
                else:
                    tokens = tokens.expand(beam_size, *tokens.shape[1:])
                    tokens = torch.cat((tokens, next_tokens), dim = 1)
            else:
                logits[is_stopped] = -float(np.inf)
                logits[is_stopped, 0] = 0
                scores_sum = scores[:, None] + logits
                seq_lengths[~is_stopped]+=1
                scores_sum_average = scores_sum / seq_lengths[:, None]
                scores_sum_average, next_tokens = scores_sum_average.view(-1).topk(beam_size, -1)
                next_tokens_source = next_tokens // scores_sum.shape[1]
                seq_lengths = seq_lengths[next_tokens_source]
                next_tokens = next_tokens % scores_sum.shape[1]
                next_tokens = next_tokens.unsqueeze(1)
                tokens = tokens[next_tokens_source]
                tokens = torch.cat((tokens, next_tokens), dim = 1)
                generated = generated[next_tokens_source]
                scores = scores_sum_average * seq_lengths
                is_stopped = is_stopped[next_tokens_source]
            next_token_embed = model.gpt.transformer.wte(next_tokens.squeeze()).view(generated.shape[0], 1, -1)
            generated = torch.cat((generated, next_token_embed), dim = 1)
            is_stopped = is_stopped + next_tokens.eq(stop_token_index).squeeze()
            if is_stopped.all():
                break
    scores = scores / seq_lengths
    output_list = tokens.cpu().numpy()
    output_texts = [tokenizer.decode(output[:int(length)]) for output, length in zip(output_list, seq_lengths)]
    order = scores.argsort(descending = True)
    output_texts = [output_texts[i] for i in order]
    return output_texts
