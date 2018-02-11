var postUrl = "XXXXXXXXXXXX"; // incomng webhookのPost ID
var postChannel = "#web-news"; // Channel
var username = 'web-news'; // ユーザー名(表示名)

/***************************************
 * Slackに投稿させる内容を作る
 ***************************************/
function postUberNewsToSlack() {
  var feedURL = 'XXXXXXXXXXXXXX';

  //フィードからデータを取得
  var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  var document = XmlService.parse(UrlFetchApp.fetch(feedURL).getContentText());
  var items = document.getRootElement().getChildren('entry', atom);

  Logger.log(items.length);

  var messages = "今日のUber関連のニュースをお届けします!";
  for(var i = 0; i < items.length; i++) {
    var title = items[i].getChild("title", atom).getValue();
    var jaTitle = LanguageApp.translate(title,'en','ja');
    var link = items[i].getChild('link', atom).getAttribute('href').getValue();
    var shortLink = UrlShortener.Url.insert({longUrl:link}).id;
    var message = "\n" + "\n" + title　 + "\n" + jaTitle + "\n" + shortLink;
    messages += message;
  }
    //HTMLタグを除去してチャットワークへ投稿
    sendHttpPost(messages.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').replace(/ユーバー/g,'Uber'), username);
  }

/***************************************
 * Slackに投稿
 ***************************************/
function sendHttpPost(message, username)
{
  var jsonData =
  {
     "channel" : postChannel,
     "username" : username,
     "text" : message
  };
  var payload = JSON.stringify(jsonData);
  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };

  UrlFetchApp.fetch(postUrl, options);
}
