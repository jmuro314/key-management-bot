function postFirstMessage() {
  const url = "https://slack.com/api/chat.postMessage";
  const channelId = PropertiesService.getScriptProperties().getProperty("SLACK_CHANNEL_ID");
  const token = PropertiesService.getScriptProperties().getProperty("SLACK_OAUTH_TOKEN");
  const blocks = createBlocks();

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Bearer " + token
  };
  const payload = {
    "channel": channelId,
    "blocks": blocks
  };
  const params = {
    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, params);
}

function doPost(e) {
  const json = JSON.parse(e.parameter.payload);
  const user = json.user.name;
  const value = json.actions[0].value;
  const responseUrl = json.response_url;
  const blocks = createBlocks(user, value);

  const payload = { "blocks": blocks };
  const params = {
    "method": "POST",
    "payload": JSON.stringify(payload)
  };

  UrlFetchApp.fetch(responseUrl, params);
}

function createBlocks(user, value) {
  let blocks = [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "<@" + user + ">が鍵を" + value,
        "emoji": true
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "借りた　:key:"
          },
          "style": "primary",
          "value": "借りました"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "返した　:lock:"
          },
          "style": "danger",
          "value": "返しました"
        }
      ]
    }
  ];
  if (user == null) {
    // headerメッセージの文章の変更
    blocks[0].text.text = "ボタンを押してね！";
  }
  return blocks;
}