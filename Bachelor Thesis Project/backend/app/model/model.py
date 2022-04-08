from torch import nn
import torch
from typing import Tuple, Optional
from transformers import GPT2LMHeadModel
T = torch.Tensor

class MLP(nn.Module):

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
            dummy_token = self.get_dummy_token(tokens.shape[0], tokens.device)
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
