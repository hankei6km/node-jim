# -*- encoding: utf-8 -*-
""" libkkc の decode 結果を JSON 文字列として出力する.

"""
import sys
import json

from gi.repository import Kkc

Kkc.init()

model = Kkc.LanguageModel.load ("sorted3");
decoder = Kkc.Decoder.create(model);

segments = decoder.decode(sys.argv[1], int(sys.argv[2]), 
    [int(c) for c in sys.argv[3:]]);

segments_array = []
for segment in segments:
  segment_array = []
  segments_array.append(segment_array);
  while segment is not None:
    segment_array.append({
      'input': segment.get_property('input'),
      'output': segment.get_property('output')
      })
    segment = segment.next

print(json.dumps(segments_array))
