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
class Utils():
    def __init__(self):
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
