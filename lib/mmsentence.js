//----
// Copyright (c) 2010-2011 hankei6km
// License: MIT License (http://opensource.org/licenses/mit-license.php)
//----
Mojo.MojiMoca.MMSentence = Mojo.MojiMoca.Class.create();
Mojo.MojiMoca.MMSentence.ModeType = {
	//入力モード兼モードのラベル(実際にはキー入力時ではなくgetTextなどでinputConvTblを取り出すときなどの動作変更に使う)
	none: 'も',
	hiragana: 'あ',
	katakana: 'カ',
	alphanumeric: 'ａ',
	half_katakana: 'ｶ',
	half_alphanumeric: 'a'
}
Mojo.MojiMoca.MMSentence.prototype = {
	initialize: function(params){
		this.prefs = params.prefs;
		this.mode = Mojo.MojiMoca.MMSentence.ModeType.hiragana;
		this.tbl = new Mojo.MojiMoca.MMSentenceTbl();
		//this.tbl.roma2hiragana = this.tbl.tbl.roma2hiragana;
		this.tbl.roma2hiraganaLen = this.tbl.roma2hiragana.length;
		this.maxRomaLen = this.tbl.roma2hiragana[0].replace.length; //もっとも長いローマ字の長さ
		this.clearText();
		this.setSegmentSeparator(" "); //文節を区切る文字
	},
	initInputConv: function(){
		this.inputConvTbl = new Array(0); //キー入力文字を確定した情報を保存する配列
		//配列のオブジェクトは{roma,hiragana}をpushされる
		//chr->確定された入力
		//sentece->確定した文字。ただしundefinedの場合は確定は行われていない暫定状態
		//mode->この情報が作成されたときの入力モード		
	},
	initSegmentSplit: function(){
		this.segmentSplitTbl = new Array(0); //各segmentがどこで分割されるかinputConvTbl基準での位置を格納する配列
		this.tgtSegment = 0; //変換中のsegment。今回は先頭しか扱わないので0固定
	},
	//----入力モード
	setMode: function(mode){
		this.mode = mode;
		this.clearTempMode();
	},
	getMode: function(skipTemp){
		var ret = this.mode;
		if (this.tempMode != undefined && skipTemp != true) {
			ret = this.tempMode;
		}
		return ret;
	},
	setTempMode: function(mode){
		//一時的入力モードの設定、tmpModeがセットされれている間はこちらが優先される。
		this.tempMode = mode;
	},
	clearTempMode: function(mode){
		delete this.tempMode;
	},
	//----sentenceをテキストとして扱った場合の処理
	clearText: function(){
		this.initInputConv();
		this.initSegmentSplit();
		this.clearTempMode();
	},
	getLength: function(){
		return (this.getText()).length;
	},
	getHiraKanaCnt: function(){
		//ひらがな、カタナカとして確定している数
		var ret = 0;
		for (var idx = 0; idx < this.inputConvTbl.length; idx++) {
			if (this.inputConvTbl[idx].sentence != undefined && this.inputConvTbl[idx].chr != this.inputConvTbl[idx].sentence) {
				ret++;
			}
		}
		return ret;
	},
	isAllHiraKana: function(){
		var ret = false;
		if (this.inputConvTbl && this.inputConvTbl.length > 0) {
			if (this.inputConvTbl[this.inputConvTbl.length - 1].sentence != undefined) {
				ret = true;
			}
		}
		return ret;
	},
	getTextSubstring: function(startPos, endPos, inmode){
		//指定された位置の単純なテキストを返す(位置はinputConvTbl基準)
		var ret = ""
		for (var idx = startPos; idx < endPos; idx++) {
		
			ret = ret + this.getChr(this.inputConvTbl[idx], inmode);
		}
		return ret;
	},
	getText: function(inmode){
		//単純なテキストを返す
		var ret = this.getTextSubstring(0, this.inputConvTbl.length, inmode);
		return ret;
	},
	setSegmentSeparator: function(c){
		//セグメントの分割位置に挿入する文字
		this.segmentSeparator = c;
	},
	getSentence: function(inmode){
		//セグメントの分割位置に空白を挿入（分割位置は1つ目のみ利用）
		var ret = this.getText(inmode);
		
		if (this.segmentSplitTbl.length > 0) {
			//分割位置があった
			var firstSentence = this.getFirstSentenceText(inmode);
			var sentence = this.getTextSubstring(this.segmentSplitTbl[0] + 1, this.inputConvTbl.length, inmode);
			ret = firstSentence + this.segmentSeparator + sentence;
		}
		return ret;
	},
	getFirstSentenceText: function(inmode){
		var ret = this.getText(inmode);
		if (this.segmentSplitTbl.length > 0) {
			//分割位置があった
			ret = this.getTextSubstring(0, this.segmentSplitTbl[0] + 1, inmode);
		}
		return ret;
	},
	rendarText: function(inmode){
		//表示用にフォーマットしたhtmlを返す
		var ret = ""
		var tmp = {};
		
		if (this.segmentSplitTbl.length == 0) {
			tmp.sentence = this.getText(inmode);
		} else {
			tmp.firstSentence = this.getTextSubstring(0, this.segmentSplitTbl[0] + 1, inmode);
			tmp.sentence = this.getTextSubstring(this.segmentSplitTbl[0] + 1, this.inputConvTbl.length, inmode);
			
		}
		ret = Mojo.View.render({
			object: tmp,
			template: Mojo.MojiMoca.templatePath + "mminput/sentence"
		});
		
		return ret;
	},
	
	modeIsHiragana: function(inmode){
		var ret = false;
		var mode = inmode ? inmode : this.getMode();
		if (mode == Mojo.MojiMoca.MMSentence.ModeType.hiragana) {
			ret = true;
		}
		return ret;
	},
	modeIsKatakana: function(inmode){
		var ret = false;
		var mode = inmode ? inmode : this.getMode();
		if (mode == Mojo.MojiMoca.MMSentence.ModeType.katakana || mode == Mojo.MojiMoca.MMSentence.ModeType.half_katakana) {
			ret = true;
		}
		return ret;
	},
	modeIsAlpha: function(inmode){
		var ret = false;
		var mode = inmode ? inmode : this.getMode();
		if (mode == Mojo.MojiMoca.MMSentence.ModeType.alphanumeric || mode == Mojo.MojiMoca.MMSentence.ModeType.half_alphanumeric) {
			ret = true;
		}
		return ret;
	},
	modeIsHalf: function(inmode){
		var ret = false;
		var mode = inmode ? inmode : this.getMode();
		if (mode == Mojo.MojiMoca.MMSentence.ModeType.half_katakana || mode == Mojo.MojiMoca.MMSentence.ModeType.half_alphanumeric) {
			ret = true;
		}
		return ret;
	},
	toZenkaku: function(src){
		var ret = "";
		for (var pos = 0; pos < src.length; pos++) {
			var chr = src.substring(pos, pos + 1);
			ret = ret + (this.tbl.hankaku2zenkaku[chr] ? this.tbl.hankaku2zenkaku[chr] : chr);
		}
		return ret;
	},
	getChr: function(inputConv, inmode){
		//inputConvからmodeにあわせたた文字(文字列のときもある)を返す
		//var mode = inmode ? inmode : this.getMode();
		var mode = inmode ? inmode : inputConv.mode;
		var ret = "";
		switch (mode) {
			case Mojo.MojiMoca.MMSentence.ModeType.hiragana:
				if (inputConv.sentence) {
					ret = inputConv.sentence;
				} else {
					ret = inputConv.chr;
				}
				ret = this.toZenkaku(ret);
				break;
			case Mojo.MojiMoca.MMSentence.ModeType.katakana:
				if (inputConv.sentence) {
					ret = this.tbl.hiragana2katakana[inputConv.sentence];
					if (ret != undefined) {
						ret = ret.zenkaku;
					} else {
						ret = inputConv.sentence;
					}
				} else {
					ret = inputConv.chr;
				}
				ret = this.toZenkaku(ret);
				break;
			case Mojo.MojiMoca.MMSentence.ModeType.half_katakana:
				if (inputConv.sentence) {
					ret = this.tbl.hiragana2katakana[inputConv.sentence];
					if (ret != undefined) {
						ret = ret.hankaku;
					} else {
						ret = inputConv.sentence;
					}
				} else {
					ret = inputConv.chr;
				}
				break;
			case Mojo.MojiMoca.MMSentence.ModeType.alphanumeric:
				ret = this.toZenkaku(inputConv.chr);
				break;
			case Mojo.MojiMoca.MMSentence.ModeType.half_alphanumeric:
				ret = inputConv.chr;
				break;
		}
		return ret;
	},
	getPrevInputConvTbl: function(){
		//直前に確定させたかの情報
		var ret = undefined;
		if (this.inputConvTbl.length > 0) {
			ret = this.inputConvTbl[this.inputConvTbl.length - 1]; //最後の文字をローマ字に確定したときの情報		
		}
		return ret;
	},
	pushInputConvTbl: function(inputConv){
		inputConv.mode = this.getMode();
		this.inputConvTbl.push(inputConv);
	},
	pushTempInputConvTbl: function(tmpBuf){
		//蓄積されたバッファーを分割しながら暫定情報として保存する
		for (var pos = 0; pos < tmpBuf.length; pos++) {
			var tmpConv = {};
			tmpConv.chr = tmpBuf.substring(pos, pos + 1); //1文字毎に分割して確定情報とする
			//暫定情報なのでsentenceはセットしない
			//暫定情報を配列へいれておく
			this.pushInputConvTbl(tmpConv);
		}
		
	},
	popTempInputConvTbl: function(tmpBuf){
		//末尾にある暫定情報をpopして、入力バッファー用の文字列を返す
		var ret = "";
		var tempSw = true;
		while (tempSw) {
			var inputConv = this.getPrevInputConvTbl();
			if (inputConv) {
				if (!inputConv.sentence) {
					//暫定情報だったので取り除いて文字列に挿入する
					this.inputConvTbl.pop();
					ret = inputConv.chr + ret;
				} else {
					//暫定情報ではなかったので、抜ける
					tempSw = false;
				}
			} else {
				//確定情報がなかったので、抜ける
				tempSw = false;
			}
		}
		
		return ret;
	},
	//--sentenceをsegmentに分割したときの処理
	setSegmentSplit: function(result){
		this.initSegmentSplit();
		
		var segIdx = 0;
		var convIdx = 0;
		for (; segIdx < result.getSegmentLength(); segIdx++) {
			var tmpText = "";
			for (; convIdx < this.inputConvTbl.length; convIdx++) {
				tmpText = tmpText + this.getChr(this.inputConvTbl[convIdx]);
				if (tmpText == result.getSegmentTextFromIdx(segIdx)) {
					this.segmentSplitTbl.push(convIdx);
					convIdx++;
					break;
				}
			}
		}
		this.tgtSegment = 0;
		
	},
	collapseSegmentSplitFromIdx: function(idx){
		//指定されたセグメントを縮める（いまは先頭しか扱わないので、とりあえず前後のセグメントは考えない）
		if (this.segmentSplitTbl[idx] > 0) {
			this.segmentSplitTbl[idx]--;
		}
	},
	expandSegmentSplitFromIdx: function(idx){
		//指定されたセグメントを広げる（いまは先頭しか扱わないので、とりあえず前後のセグメントは考えない）
		if (this.segmentSplitTbl[idx] + 1 < this.inputConvTbl.length) {
			this.segmentSplitTbl[idx]++;
		}
		
	},
	collapseSegmentSplitMinFromIdx: function(idx){
		//指定されたセグメントを最小まで縮める（いまは先頭しか扱わないので、とりあえず前後のセグメントは考えない）
		this.segmentSplitTbl[idx] = 0;
	},
	expandSegmentSplitMaxFromIdx: function(idx){
		//指定されたセグメントを最大まで広げる（いまは先頭しか扱わないので、とりあえず前後のセグメントは考えない）
		this.segmentSplitTbl[idx] = this.inputConvTbl.length - 1;
		
	},
	collapseSegmentSplit: function(){
		this.collapseSegmentSplitFromIdx(this.tgtSegment);
	},
	expandSegmentSplit: function(){
		this.expandSegmentSplitFromIdx(this.tgtSegment);
	},
	collapseSegmentSplitMin: function(){
		this.collapseSegmentSplitMinFromIdx(this.tgtSegment);
	},
	expandSegmentSplitMax: function(){
		this.expandSegmentSplitMaxFromIdx(this.tgtSegment);
	},
	//--キー入力に対する処理
	addChr: function(chr){
		if (this.modeIsAlpha()) {
			var tmpConv = {};
			tmpConv.chr = chr;
			tmpConv.sentence = chr;
			this.pushInputConvTbl(tmpConv);
		} else {
			var mathRoma = true;
			var buf = "";
			while (mathRoma) { //bufへ文字を追加することで連続してローマ字に確定することがあるので("n"に"."を追加したときなど)、
				//確定している（hirが存在している)間はループさせる
				mathRoma = undefined;
				
				//変換テーブルに暫定情報があるか確認
				buf = this.popTempInputConvTbl() + chr;
				chr = ""; //ループした後は追加しない
				//ローマ字に確定できるか調べる
				for (var idx = 0; idx < this.tbl.roma2hiraganaLen; idx++) {
					mathRoma = buf.match(this.tbl.roma2hiragana[idx]["replace"]);
					if (mathRoma) {
						mathRoma = mathRoma[0];
						break;
					}
				}
				
				if (mathRoma) {
					var tmpBuf = buf.replace(this.tbl.roma2hiragana[idx]["replace"], "");//ローマ字にmatchした部分を削って、確定できなかった文字を取り出す
					if (tmpBuf) {
						//確定できなかったが後続にローマ字がきたの暫定として処理する
						this.pushTempInputConvTbl(tmpBuf);
						
						buf = buf.substring(tmpBuf.length, buf.length); //確定できなかった文字を削る
					}
					
					
					var romaConv = {}; //ローマ字を確定させるときの情報
					//確定できたのでローマ字と対応するかなをromaConvへ入れる
					if (this.tbl.roma2hiragana[idx]["roma"]) {
						romaConv.chr = this.tbl.roma2hiragana[idx]["roma"];
					} else {
						//ローマ字の対応情報がなかったので、matchした文字列を使う
						romaConv.chr = mathRoma;
					}
					romaConv.sentence = this.tbl.roma2hiragana[idx]["hiragana"];
					
					//bufを置き換える
					buf = buf.replace(this.tbl.roma2hiragana[idx]["replace"], this.tbl.roma2hiragana[idx]["with"]);
					
					//確定情報を配列へいれておく
					this.pushInputConvTbl(romaConv);
				}
				
				//残ったbufを暫定的に処理する
				if (buf.length > 0) {
					this.pushTempInputConvTbl(buf);
				}
				
			}
		}
		this.debuginputConvTblPrint();
		
	},
	delChr: function(){
		var ret = false;
		//ローマ字確定情報からhiraganaの末尾を取り除いておく
		var romaConv = this.getPrevInputConvTbl();
		if (romaConv) {//ローマ字の確定情報があった（取り除く末尾があった）
			this.inputConvTbl.pop(); //情報を取り除いておく
			this.debuginputConvTblPrint();
		}
		if (this.inputConvTbl.length == 0) {
			ret = true; //全て削除したらtrueを返す
		}
		return ret;
	},
	delayInput: function(text, inmode){
		//textを入力された文字として扱う。対象外の文字があった場合はerrResultを返す。
		var mode = inmode ? inmode : this.getMode();
		var ret = undefined;
		
		//エラーチェック
		for (var idx = 0; idx < text.length; idx++) {
			if (this.prefs.delayInputOnlyHalfChars && !(Mojo.Char.isValidWrittenAsciiChar(text.charCodeAt(idx)))) {
			
				var errResult = new Mojo.MojiMoca.MMError(Mojo.MojiMoca.MMError.Type.input).getErrResult(Mojo.MojiMoca.MMError.Code.input.invalidcahr);
				
				var t = new Mojo.MojiMoca.Format.Template(errResult.message); //エラーになった文字をmessageへ埋め込む
				errResult.message = t.evaluate({
					invalidchar: text.substring(idx, idx + 1)
				});
				
				return errResult;
			}
		}
		
		for (var idx = 0; idx < text.length; idx++) {
			var chr = text.substring(idx, idx + 1);
			if (this.prefs.delayInputOnlyHalfChars == false || Mojo.Char.isValidWrittenAsciiChar(chr.charCodeAt(0))) {
				this.addChr(chr)
			}
		}
		
		return ret;
		
	},
	removeSegment: function(segmentText){
		//指定されたsegmentTextを先頭から除去する
		var tmpText = "";
		for (var idx = 0; idx < this.inputConvTbl.length; idx++) {
			tmpText = tmpText + this.getChr(this.inputConvTbl[idx]);
			if (tmpText == segmentText) {
				var hit = idx;
				break;
			}
		}
		if (hit != undefined) {
			for (idx = 0; idx <= hit; idx++) {
				this.inputConvTbl.shift();
			}
		}
	},
	fixTailN: function(){
		//確定していない"n"があれば確定させる
		var romaConv = this.getPrevInputConvTbl();
		if (romaConv) {
			if (!romaConv.sentence) {
				if (romaConv.chr.toLocaleLowerCase() == "n") {
					romaConv.sentence = "ん";
				}
			}
		}
	},
	getTailChars: function(){
		//末尾の確定していない情報から候補となる文字一覧を文字列として取得する
		var ret = [];
		var romaConv = this.getPrevInputConvTbl();
		if (romaConv) {
			if (!romaConv.sentence) {
				for (var idx = 0; idx < this.tbl.roma2hiragana_fixLen; idx++) {
					if (romaConv.chr == this.tbl.roma2hiragana_fix[idx]["roma"]) {
						//console.log("hiragana:"+JSON.stringify(this.tbl.roma2hiragana_fix[idx]["hiragana"]));
						ret = this.tbl.roma2hiragana_fix[idx]["hiragana"];
						break;
					}
				}
			}
		}
		return ret;
	},
	getTailRawChars: function(){
		//末尾の確定していない文字を取得する
		var ret = "";
		var len = this.inputConvTbl.length;
		for (var idx = 0; idx < len; idx++) {
			if (!(this.inputConvTbl[idx].sentence)) {
				ret = tails + this.inputConvTbl[idx].chr;
			}
		}
		return ret;
	},
	debuginputConvTblPrint: function(){
		//for (var idx = 0; idx < this.inputConvTbl.length; idx++) {
		//	Mojo.Log.info("bufConv idx:" + idx + " val:%j", this.inputConvTbl[idx])
		//}
	}
};
