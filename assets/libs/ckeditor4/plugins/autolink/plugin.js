/*
 Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function(){var f=/"/g;CKEDITOR.plugins.add("autolink",{requires:"clipboard,textmatch",init:function(c){function e(a){a={text:a,link:a.replace(f,"%22")};a=a.link.match(CKEDITOR.config.autolink_urlRegex)?g.output(a):h.output(a);if(c.plugins.link){a=CKEDITOR.dom.element.createFromHtml(a);var b=CKEDITOR.plugins.link.parseLinkAttributes(c,a),b=CKEDITOR.plugins.link.getLinkAttributes(c,b);CKEDITOR.tools.isEmpty(b.set)||a.setAttributes(b.set);b.removed.length&&a.removeAttributes(b.removed);a.removeAttribute("data-cke-saved-href");
a=a.getOuterHtml()}return a}function k(a,b){var c=a.slice(0,b).split(/\s+/);return(c=c[c.length-1])&&d(c)?{start:a.lastIndexOf(c),end:b}:null}function d(a){return a.match(CKEDITOR.config.autolink_urlRegex)||a.match(CKEDITOR.config.autolink_emailRegex)}var g=new CKEDITOR.template('\x3ca href\x3d"{link}"\x3e{text}\x3c/a\x3e'),h=new CKEDITOR.template('\x3ca href\x3d"mailto:{link}"\x3e{text}\x3c/a\x3e');c.on("paste",function(a){if(a.data.dataTransfer.getTransferType(c)!=CKEDITOR.DATA_TRANSFER_INTERNAL){var b=
a.data.dataValue;-1<b.indexOf("\x3c")||!d(b)||(a.data.dataValue=e(b),a.data.type="html")}});if(!CKEDITOR.env.ie||CKEDITOR.env.edge){var l=c.config.autolink_commitKeystrokes||CKEDITOR.config.autolink_commitKeystrokes;c.on("key",function(a){if("wysiwyg"===c.mode&&-1!=CKEDITOR.tools.indexOf(l,a.data.keyCode)){var b=CKEDITOR.plugins.textMatch.match(c.getSelection().getRanges()[0],k);if(b&&(a=c.getSelection(),!a.getRanges()[0].startContainer.getAscendant("a",!0)&&(a.selectRanges([b.range]),c.insertHtml(e(b.text),
"text"),!CKEDITOR.env.webkit))){var b=a.getRanges()[0],d=c.createRange();d.setStartAfter(b.startContainer);a.selectRanges([d])}}})}}});CKEDITOR.config.autolink_commitKeystrokes=[13,32];CKEDITOR.config.autolink_urlRegex=/^(https?|ftp):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?[^\s\.,]$/i;CKEDITOR.config.autolink_emailRegex=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/})();