/**
 * メッセージ表示.
 * @author hankei6km
 * @copyright (c) 2013 hankei6km
 * @license MIT License (http://opensource.org/licenses/mit-license.php)
 */

/**
 * 一定時間メッセージを表示する.
 * @return {object} メッセージを制御するメソッドを含むオブジェクト.
 * @param {object} $outer メッセージの親要素のjqueryオブジェクト.
 */
var Messages = function($outer){

  return {
    show: function(msg){
      var t = '<div class="messages">' + _.escape(msg) + "</div>";
      $outer.prepend(t);
      var $msg = $outer.children().first();
      $msg.slideDown('slow', function(){
        setTimeout(function(){
          $msg.slideUp('slow', function(){
            $msg.remove();
          });
        },5000);
      });
    }
  };
}
