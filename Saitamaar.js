/*
 *  # Saitamaar.js
 *
 *  - AA 表示用フォント Saitamaar を AA っぽい要素に適用するスクリプト
 *  - (c) YAMASINA Keage - http://keage.sakura.ne.jp
 *  - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 *  - 2014-09-11T00:30:00Z
 *
 */
(function() {

  function returnCharCode(code) {
    return String.fromCharCode(code);
  }

  function setFontFace() {

    var doc = document, frag = doc.createDocumentFragment(), link = doc.createElement('link');

    link.rel = 'stylesheet';
    link.setAttribute('href', "data:text/css, dl dd{ margin-left: 5px; }" +
      "@font-face{" +
        "font-family: 'Stmr';" +
        "src: local('Saitamaar')," +
        "url('http://keage.sakura.ne.jp/fonts/Saitamaar.eot?') format('eot')," +
        "url('http://keage.sakura.ne.jp/fonts/Saitamaar.woff.php') format('woff')," +
        "url('http://keage.sakura.ne.jp/fonts/Saitamaar.ttf.php') format('truetype');" +
        "font-weight: normal;" +
      "}");

    frag.appendChild(link);

    doc.getElementsByTagName('head')[0].appendChild(frag);
  }

  // AA が含まれているっぽい要素を再帰的に探索
  function searchAA(node, regex, flag, preFlag) {

    var i, childNodes = node.childNodes, childNode, childNodeTag, childNodeType, nodeClass = node.className, nodeStyle = node.style;
    var whiteSpace = nodeStyle.getPropertyValue("white-space"), disp = nodeStyle.getPropertyValue("display");

    // 探索から除外するタグ + PRE 要素
    var specialTag = {'BR' : 1, 'IMG' : 1, 'STYLE' : 1, 'SCRIPT' : 1,'HR' : 1, 'NOSCRIPT' : 1, 'PRE' : 2};

    for (i = childNodes.length; i--;) {

      childNode     = childNodes[i];
      childNodeType = childNode.nodeType;
      childNodeTag  = childNode.tagName;

      if (childNodeType === 1 && specialTag[childNodeTag] !== 1) {
        if (specialTag[childNodeTag] === 2) {
          preFlag = true;
        }
        flag = searchAA(childNode, regex, flag, preFlag);
      } else if (childNodeType === 3 && (disp === null || disp.toLowerCase() !== 'none')) {
        if (childNode.nodeValue.search(regex) !== -1) {
          nodeStyle.cssText = 'font-family:              Stmr, sans-serif !important;' +
                              'font-size:                16px;' +
                              'font-weight:              normal;' +
                              'line-height:              18px;' +
                              'word-break:               break-all;' +
                              'display:                  block;' +
                              'overflow-x:               auto;' +
                              'overflow-y:               hidden;' +
                              '-webkit-font-smoothing:   antialiased;' +
                              '-moz-text-size-adjust:    none;' +
                              '-ms-text-size-adjust:     100%;' +
                              '-webkit-text-size-adjust: 100%;' +
                              'text-size-adjust:         100%;' +
                              'color:' +                 nodeStyle.color;

          // PRE 要素もしくは CSS で white-space: pre; が指定されてる要素には white-space: pre; を
          // それ以外の要素には white-space: nowrap; を指定
          if (whiteSpace === null) {
            nodeStyle.whiteSpace =　(preFlag !== true && node.tagName !== 'PRE') ? 'nowrap' : 'pre';
          } else {
            nodeStyle.whiteSpace = (whiteSpace.toLowerCase() !== 'pre') ? 'nowrap' : 'pre';
          }

          if (nodeClass.search('aaExist') === -1) {
            node.className += ' aaExist';
            flag = true;
          }
          break;
        }
      }
    }
    return flag;
  }

  function aaApply() {

    // AA 判定用正規表現
    var regex = /[■□　三圭ﾉ￣┏┳╋━┻┓┌┬┼─┴┐(:i)]{6} ?|['";\:█▃,\^]{4}|[＿ヮ｀´＼]{1}/;
    var doc = document, flag = false, preFlag = false, body = doc.getElementsByTagName('body')[0];

    flag = searchAA(body, regex, flag, preFlag);
    if (flag !== false) {
      setFontFace();
    }
  }

  function aaFont() {

    var doc = document, i, j, html, replaced, aaExist = doc.getElementsByClassName('aaExist'), body = doc.getElementsByTagName("body")[0], aa, searchChar, replaceChar;

    // arrayOfSearchChar 内のコードの文字は WebKit 環境で正しく表示されないので同等のグリフを別途用意して置換
    var arrayOfSearchChar  = [9, 768, 769, 770, 771, 772, 776, 779, 783, 792, 809, 827, 861, 862, 863, 1155, 1156, 1158];
    var arrayOfReplaceChar = [8203, 59768, 59769, 59770, 59771, 59772, 59776, 59779, 59783, 59792, 59809, 59827, 59861, 59862, 59863, 60155, 60156, 60158];

    searchChar  = arrayOfSearchChar.map(function(code){ return RegExp(returnCharCode(code), "g"); });
    replaceChar = arrayOfReplaceChar.map(function(code){ return returnCharCode(code); });

    aaApply();

    for (i = aaExist.length; i--;) {
      aa = aaExist[i];
      html = aa.innerHTML.toString();
      replaced = false;

      for (j = searchChar.length; j--;) {
        if (html.indexOf(returnCharCode(arrayOfSearchChar[j])) !== -1) {
          html = html.replace(searchChar[j], replaceChar[j]);
          replaced = true;
        }
      }
      if (replaced === true){
        aa.innerHTML = html;
      }
    }
  }

  aaFont();

})();
