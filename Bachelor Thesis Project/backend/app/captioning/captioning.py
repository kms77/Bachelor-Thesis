from IPython.core.display_functions import display
import numpy as np
import clip
import torch
import torch.nn.functional as nnf
from transformers import GPT2Tokenizer
from tqdm import trange
import skimage.io as io
import PIL.Image
from IPython.display import Image
from model.model import ClipCaptionModel

T = torch.Tensor


class Captioning():
    def generate_beam(self, model, tokenizer, beam_size: int = 5, prompt=None, embed=None, entry_length=67,
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
                        tokens = torch.cat((tokens, next_tokens), dim=1)
                else:
                    logits[is_stopped] = -float(np.inf)
                    logits[is_stopped, 0] = 0
                    scores_sum = scores[:, None] + logits
                    seq_lengths[~is_stopped] += 1
                    scores_sum_average = scores_sum / seq_lengths[:, None]
                    scores_sum_average, next_tokens = scores_sum_average.view(-1).topk(beam_size, -1)
                    next_tokens_source = next_tokens // scores_sum.shape[1]
                    seq_lengths = seq_lengths[next_tokens_source]
                    next_tokens = next_tokens % scores_sum.shape[1]
                    next_tokens = next_tokens.unsqueeze(1)
                    tokens = tokens[next_tokens_source]
                    tokens = torch.cat((tokens, next_tokens), dim=1)
                    generated = generated[next_tokens_source]
                    scores = scores_sum_average * seq_lengths
                    is_stopped = is_stopped[next_tokens_source]
                next_token_embed = model.gpt.transformer.wte(next_tokens.squeeze()).view(generated.shape[0], 1, -1)
                generated = torch.cat((generated, next_token_embed), dim=1)
                is_stopped = is_stopped + next_tokens.eq(stop_token_index).squeeze()
                if is_stopped.all():
                    break
        scores = scores / seq_lengths
        output_list = tokens.cpu().numpy()
        output_texts = [tokenizer.decode(output[:int(length)]) for output, length in zip(output_list, seq_lengths)]
        order = scores.argsort(descending=True)
        output_texts = [output_texts[i] for i in order]
        return output_texts

    def generate_caption(self,
                         model,
                         tokenizer,
                         tokens=None,
                         prompt=None,
                         embed=None,
                         entry_count=1,
                         entry_length=67,  # maximum number of words
                         top_p=0.8,
                         temperature=1.,
                         stop_token: str = '.',
                         ):
        model.eval()
        generated_list = []
        stop_token_index = tokenizer.encode(stop_token)[0]
        filter_value = -float("Inf")
        device = next(model.parameters()).device

        with torch.no_grad():
            for entry_idx in trange(entry_count):
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
                    sorted_logits, sorted_indices = torch.sort(logits, descending=True)
                    cumulative_probs = torch.cumsum(nnf.softmax(sorted_logits, dim=-1), dim=-1)
                    sorted_indices_to_remove = cumulative_probs > top_p
                    sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[
                                                        ..., :-1
                                                        ].clone()
                    sorted_indices_to_remove[..., 0] = 0
                    indices_to_remove = sorted_indices[sorted_indices_to_remove]
                    logits[:, indices_to_remove] = filter_value
                    next_token = torch.argmax(logits, -1).unsqueeze(0)
                    next_token_embed = model.gpt.transformer.wte(next_token)
                    if tokens is None:
                        tokens = next_token
                    else:
                        tokens = torch.cat((tokens, next_token), dim=1)
                    generated = torch.cat((generated, next_token_embed), dim=1)
                    if stop_token_index == next_token.item():
                        break
                output_list = list(tokens.squeeze().cpu().numpy())
                output_text = tokenizer.decode(output_list)
                generated_list.append(output_text)
        return generated_list[0]

    def get_image_caption(self):
        clip_model, preprocess = clip.load("ViT-B/32", jit=False)
        tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        prefix_length = 10
        model = ClipCaptionModel(prefix_length)
        model.load_state_dict(torch.load(
            "./utils/pretrained_models/conceptual_weights.pt",
            map_location=torch.device('cpu')))
        model = model.eval()
        model = model.to("cpu")
        UPLOADED_FILE = "./utils/image/image.jpg"
        use_beam_search = False  # @param {type:"boolean"}
        image = io.imread(UPLOADED_FILE)
        pil_image = PIL.Image.fromarray(image)
        pil_img = Image(filename=UPLOADED_FILE)
        display(pil_image)
        image = preprocess(pil_image).unsqueeze(0).to("cpu")
        with torch.no_grad():
            prefix = clip_model.encode_image(image).to("cpu", dtype=torch.float32)
            prefix_embed = model.clip_project(prefix).reshape(1, prefix_length, -1)
        if use_beam_search:
            generated_text_prefix = self.generate_beam(model, tokenizer, embed=prefix_embed)[0]
        else:
            generated_text_prefix = self.generate_caption(model, tokenizer, embed=prefix_embed)
        print('\n')
        print(generated_text_prefix)
        return generated_text_prefix
