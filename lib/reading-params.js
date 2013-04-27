"use strict"

/**
 * 末尾の確定されてないローマ字から、確定されそうな候補をさがす.
 */
module.exports = function(sentence){
  var ret = {
    readingFilter: sentence
  };
  for (var idx = 0; idx < rawchars2hiraganatbl_len; idx++) {
    if (sentence.match(rawchars2hiraganatbl[idx].roma)) {
      var readingFilter = sentence.replace(rawchars2hiraganatbl[idx].roma, "");
      ret.readingFilter = readingFilter;
      ret.readingRegExp = new RegExp("^" + readingFilter + rawchars2hiraganatbl[idx].hiragana);
      break;
    }
  }

  //readingFilterが存在しないとき(最初のローマ字が確定されてないとき)の調整
  if (!ret.readingRegExp) {
    ret.readingRegExp = new RegExp("^" + sentence);
    ret.readingFilter = sentence;
  }

  return ret;
};

var rawchars2hiraganatbl = [{
  "roma": /[dｄ]['’][yｙ]$/i,
  "hiragana": "でゅ"
}, {
  "roma": /[xｘ][tｔ][sｓ]$/i,
  "hiragana": "っ"
}, {
  "roma": /[tｔ]['’][yｙ]$/i,
  "hiragana": "てゅ"
}, {
  "roma": /[hｈ][wｗ][yｙ]$/i,
  "hiragana": "ふゅ"
}, {
  "roma": /[lｌ][tｔ][sｓ]$/i,
  "hiragana": "っ"
}, {
  "roma": /[gｇ][wｗ]$/i,
  "hiragana": "ぐぁ"
}, {
  "roma": /[xｘ][kｋ]$/i,
  "hiragana": "((ヵ)|(ヶ))"
}, {
  "roma": /[cｃ][hｈ]$/i,
  "hiragana": "((ち)|(ちぇ)|(ちゃ)|(ちゅ)|(ちょ))"
}, {
  "roma": /[dｄ]['’]$/i,
  "hiragana": "((でぃ)|(でゅ)|(どぅ))"
}, {
  "roma": /[dｄ][yｙ]$/i,
  "hiragana": "((ぢゃ)|(ぢゅ)|(ぢょ))"
}, {
  "roma": /[gｇ][yｙ]$/i,
  "hiragana": "((ぎゃ)|(ぎゅ)|(ぎょ))"
}, {
  "roma": /[rｒ][yｙ]$/i,
  "hiragana": "((りゃ)|(りゅ)|(りょ))"
}, {
  "roma": /[cｃ][yｙ]$/i,
  "hiragana": "((ちゃ)|(ちゅ)|(ちょ))"
}, {
  "roma": /[xｘ][yｙ]$/i,
  "hiragana": "((ゃ)|(ゅ)|(ょ))"
}, {
  "roma": /[zｚ][yｙ]$/i,
  "hiragana": "((じぇ)|(じゃ)|(じゅ)|(じょ))"
}, {
  "roma": /[vｖ][yｙ]$/i,
  "hiragana": "ヴゅ"
}, {
  "roma": /[lｌ][kｋ]$/i,
  "hiragana": "((ヵ)|(ヶ))"
}, {
  "roma": /[xｘ][tｔ]$/i,
  "hiragana": "っ"
}, {
  "roma": /[lｌ][wｗ]$/i,
  "hiragana": "ゎ"
}, {
  "roma": /[tｔ][yｙ]$/i,
  "hiragana": "((ちぇ)|(ちゃ)|(ちゅ)|(ちょ))"
}, {
  "roma": /[tｔ][wｗ]$/i,
  "hiragana": "とぅ"
}, {
  "roma": /[pｐ][yｙ]$/i,
  "hiragana": "((ぴゃ)|(ぴゅ)|(ぴょ))"
}, {
  "roma": /[tｔ][sｓ]$/i,
  "hiragana": "((つ)|(つぁ)|(つぃ)|(つぇ)|(つぉ))"
}, {
  "roma": /[xｘ][wｗ]$/i,
  "hiragana": "ゎ"
}, {
  "roma": /[nｎ][yｙ]$/i,
  "hiragana": "((にゃ)|(にゅ)|(にょ))"
}, {
  "roma": /[lｌ][tｔ]$/i,
  "hiragana": "っ"
}, {
  "roma": /[tｔ][hｈ]$/i,
  "hiragana": "((てぃ)|(てゅ))"
}, {
  "roma": /[tｔ]['’]$/i,
  "hiragana": "((てぃ)|(てゅ)|(とぅ))"
}, {
  "roma": /[lｌ][yｙ]$/i,
  "hiragana": "((ゃ)|(ゅ)|(ょ))"
}, {
  "roma": /[hｈ][yｙ]$/i,
  "hiragana": "((ひゃ)|(ひゅ)|(ひょ))"
}, {
  "roma": /[jｊ][yｙ]$/i,
  "hiragana": "((じゃ)|(じゅ)|(じょ))"
}, {
  "roma": /[dｄ][hｈ]$/i,
  "hiragana": "((でぃ)|(でゅ))"
}, {
  "roma": /[fｆ][yｙ]$/i,
  "hiragana": "ふゅ"
}, {
  "roma": /[hｈ][wｗ]$/i,
  "hiragana": "((ふぁ)|(ふぃ)|(ふぇ)|(ふぉ)|(ふゅ))"
}, {
  "roma": /[wｗ][hｈ]$/i,
  "hiragana": "((うぃ)|(うぇ)|(うぉ))"
}, {
  "roma": /[sｓ][yｙ]$/i,
  "hiragana": "((しぇ)|(しゃ)|(しゅ)|(しょ))"
}, {
  "roma": /[dｄ][wｗ]$/i,
  "hiragana": "どぅ"
}, {
  "roma": /[bｂ][yｙ]$/i,
  "hiragana": "((びゃ)|(びゅ)|(びょ))"
}, {
  "roma": /[wｗ][yｙ]$/i,
  "hiragana": "((ゐ)|(ゑ))"
}, {
  "roma": /[sｓ][hｈ]$/i,
  "hiragana": "((し)|(しぇ)|(しゃ)|(しゅ)|(しょ))"
}, {
  "roma": /[kｋ][wｗ]$/i,
  "hiragana": "((くぁ)|(くぃ)|(くぇ)|(くぉ))"
}, {
  "roma": /[kｋ][yｙ]$/i,
  "hiragana": "((きゃ)|(きゅ)|(きょ))"
}, {
  "roma": /[mｍ][yｙ]$/i,
  "hiragana": "((みゃ)|(みゅ)|(みょ))"
}, {
  "roma": /[rｒ]$/i,
  "hiragana": "((っ)|(ら)|(り)|(りゃ)|(りゅ)|(りょ)|(る)|(れ)|(ろ))"
}, {
  "roma": /[cｃ]$/i,
  "hiragana": "((ち)|(ちぇ)|(ちゃ)|(ちゅ)|(ちょ)|(っ))"
}, {
  "roma": /[bｂ]$/i,
  "hiragana": "((っ)|(ば)|(び)|(びゃ)|(びゅ)|(びょ)|(ぶ)|(べ)|(ぼ))"
}, {
  "roma": /[dｄ]$/i,
  "hiragana": "((だ)|(ぢ)|(ぢゃ)|(ぢゅ)|(ぢょ)|(っ)|(づ)|(で)|(でぃ)|(でゅ)|(ど)|(どぅ))"
}, {
  "roma": /[gｇ]$/i,
  "hiragana": "((が)|(ぎ)|(ぎゃ)|(ぎゅ)|(ぎょ)|(ぐ)|(ぐぁ)|(げ)|(ご)|(っ))"
}, {
  "roma": /[fｆ]$/i,
  "hiragana": "((っ)|(ふ)|(ふぁ)|(ふぃ)|(ふぇ)|(ふぉ)|(ふゅ))"
}, {
  "roma": /[hｈ]$/i,
  "hiragana": "((っ)|(は)|(ひ)|(ひゃ)|(ひゅ)|(ひょ)|(ふ)|(ふぁ)|(ふぃ)|(ふぇ)|(ふぉ)|(ふゅ)|(へ)|(ほ))"
}, {
  "roma": /[kｋ]$/i,
  "hiragana": "((か)|(き)|(きゃ)|(きゅ)|(きょ)|(く)|(くぁ)|(くぃ)|(くぇ)|(くぉ)|(け)|(こ)|(っ))"
}, {
  "roma": /[jｊ]$/i,
  "hiragana": "((じ)|(じぇ)|(じゃ)|(じゅ)|(じょ)|(っ))"
}, {
  "roma": /[mｍ]$/i,
  "hiragana": "((っ)|(ま)|(み)|(みゃ)|(みゅ)|(みょ)|(む)|(め)|(も))"
}, {
  "roma": /[lｌ]$/i,
  "hiragana": "((ぁ)|(ぃ)|(ぅ)|(ぇ)|(ぉ)|(っ)|(ゃ)|(ゅ)|(ょ)|(ゎ)|(ヵ)|(ヶ))"
}, {
  "roma": /[nｎ]$/i,
  "hiragana": "((な)|(に)|(にゃ)|(にゅ)|(にょ)|(ぬ)|(ね)|(の)|(ん))"
}, {
  "roma": /[qｑ]$/i,
  "hiragana": "((くぁ)|(くぃ)|(くぇ)|(くぉ)|(っ))"
}, {
  "roma": /[pｐ]$/i,
  "hiragana": "((っ)|(ぱ)|(ぴ)|(ぴゃ)|(ぴゅ)|(ぴょ)|(ぷ)|(ぺ)|(ぽ))"
}, {
  "roma": /[sｓ]$/i,
  "hiragana": "((さ)|(し)|(しぇ)|(しゃ)|(しゅ)|(しょ)|(す)|(せ)|(そ)|(っ))"
}, {
  "roma": /[tｔ]$/i,
  "hiragana": "((た)|(ち)|(ちぇ)|(ちゃ)|(ちゅ)|(ちょ)|(っ)|(つ)|(つぁ)|(つぃ)|(つぇ)|(つぉ)|(て)|(てぃ)|(てゅ)|(と)|(とぅ))"
}, {
  "roma": /[wｗ]$/i,
  "hiragana": "((うぃ)|(うぇ)|(うぉ)|(っ)|(わ)|(ゐ)|(ゑ)|(を))"
}, {
  "roma": /[vｖ]$/i,
  "hiragana": "((っ)|(ヴ)|(ヴぁ)|(ヴぃ)|(ヴぇ)|(ヴぉ)|(ヴゅ))"
}, {
  "roma": /[yｙ]$/i,
  "hiragana": "((いぇ)|(っ)|(や)|(ゆ)|(よ))"
}, {
  "roma": /[xｘ]$/i,
  "hiragana": "((ぁ)|(ぃ)|(ぅ)|(ぇ)|(ぉ)|(っ)|(ゃ)|(ゅ)|(ょ)|(ゎ)|(ヵ)|(ヶ))"
}, {
  "roma": /[zｚ]$/i,
  "hiragana": "((ざ)|(じ)|(じぇ)|(じゃ)|(じゅ)|(じょ)|(ず)|(ぜ)|(ぞ)|(っ))"
}];

var rawchars2hiraganatbl_len = rawchars2hiraganatbl.length;
