const extract = require('we-extract').extract;
var TurndownService = require('turndown');

async function convertToMarkdown(url) {
  const r = await extract(url, {
    shouldReturnContent: true,
    shouldExtractMpLinks: false,
    shouldExtractTags: false,
    shouldExtractRepostMeta: false
  });

  var turndownService = new TurndownService();
  turndownService.addRule('img', {
    filter: ['img','video','audio'],
    replacement: function (content, node) {
      var alt = node.alt || ''
      var src = node.getAttribute('data-src') || ''
      var title = node.title || ''
      var markdown = '![' + alt + '](' + src + ' "' + title + '")'
      return markdown
    }
  });
  
  var markdown = turndownService.turndown(r.data.msg_content);
  return markdown;
}

// 使用函数
// convertToMarkdown('https://mp.weixin.qq.com/s/c5PJJvVb-ouhCft4lespBg');

module.exports = {
  convertToMarkdown
};