const Discord = require('discord.js');
const client = new Discord.Client();
const Tail = require('tail').Tail;
const axios = require('axios').default;

const Hashrate = require('js-hashrate-parser');
const BigNumber = require('bignumber.js');


const filepath = "../PhoenixMiner_5.6a_Windows/logs/log20210502_193651.txt";
const options = {
  fromBeginning: true,
  useWatchFile: true
};

const tail = new Tail(filepath, options);


(async () => {
  const miner_address = '39eD2b3602bd99E3437d18AbC77751F909d92493'




  await client.login('NTgxNjYwNTA3NjY5MjY2NDYy.XOifjw.WdIg5Ays4kn4Vw80iTO8Ixm7gS8');

  await client.on('ready', () => {
      /*client.channels.cache.get('838313783931306045')
          .send(`:white_check_mark:  SFireW 挖礦機器人已啟動`)*/

      console.log(`Logged in as ${client.user.tag}!`);
  });

  await client.on('message', msg => {


    // 取得礦機狀態
    if (msg.content === '!狀態') {
      axios.get(`https://api.ethermine.org/miner/${miner_address}/currentStats`)
      .then(function (response) {
        let result = response.data
        let embed = {}

        if(result.status === 'OK') {
            let minerStatus = result.data

            let usdPerMin = minerStatus.usdPerMin
            let USDDaily = new BigNumber(usdPerMin).multipliedBy(60).multipliedBy(24).toNumber()
            let USDtoTWD = new BigNumber(USDDaily).multipliedBy(27.86).toNumber()

            let minerEmbed = {
              embed: {
                "title": '總狀態',
                "description": miner_address + ' 運作中',
                "url": `https://ethermine.org/miners/${miner_address}`,
                "color": '#1c5fff',
                "timestamp": Date.now(),
                "fields": [
                  {
                    "name": "現在的算力 (雜湊率)",
                    "value": Hashrate.toString(minerStatus.currentHashrate),
                    "inline": false
                  },
                  {
                    "name": "回報的算力 (雜湊率)",
                    "value": Hashrate.toString(minerStatus.reportedHashrate),
                    "inline": false
                  },
                  {
                    "name": "有效的分享",
                    "value": minerStatus.validShares,
                    "inline": false
                  },
                  {
                    "name": "在在運作的礦機",
                    "value": minerStatus.activeWorkers,
                    "inline": false
                  },
                  {
                    "name": "最後一次出現在",
                    "value": time2TimeAgo(minerStatus.lastSeen),
                    "inline": false
                  },
                ],
                //"author": {
                //    "name": "SFireW AI - Web Service - Snow",
                    //"url": "https://sfirew.com",
                //    "icon_url": "https://cdn.discordapp.com/avatars/581660507669266462/b21849df98e1d2125cca52e1064356b1.png?size=256"
                //},
                "footer": {
                    "text": "SFireW AI - 礦機模式",
                    "icon_url": "https://cdn.discordapp.com/avatars/581660507669266462/b21849df98e1d2125cca52e1064356b1.png?size=256"
                },
              }
            }
            msg.channel.send(minerEmbed)

            embed = getWorkerEmbed(
              `一天收益 ${Math.round(USDtoTWD)} 台幣`,
              '',
              '#32f728',
              `https://ethermine.org/miners/${miner_address}/dashboard`
            )
            msg.channel.send(embed);

        } else {
          embed = getWorkerEmbed(
            'Ehtermine 礦機狀態',
            '沒有礦機在運作',
            '#f72828',
            `https://ethermine.org/miners/${miner_address}/dashboard`
          )
          msg.channel.send(embed)

        }

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

    } else if (msg.content === '!礦機狀態') {
      axios.get(`https://api.ethermine.org/miner/${miner_address}/workers`)
      .then(function (response) {
        let data = response.data
        let embed = {}

        
        if(data.status === 'OK') {
          embed = getWorkerEmbed(
            'Ehtermine 礦機狀態',
            '正常運作中',
            '#32f728',
            `https://ethermine.org/miners/${miner_address}/dashboard`
          )
          msg.channel.send(embed);

          // worker 列表
          data.data.forEach((item) => {
            let workerEmbed = {
              embed: {
                "title": '礦機: ' + item.worker,
                "description": '正在運作中',
                "url": `https://ethermine.org/miners/${miner_address}/worker/` + item.worker,
                "color": '#1c5fff',
                "timestamp": Date.now(),
                "fields": [
                  {
                    "name": "現在的算力 (雜湊率)",
                    "value": Hashrate.toString(item.currentHashrate),
                    "inline": true
                  },
                  {
                      "name": "回報的算力 (雜湊率)",
                      "value": Hashrate.toString(item.reportedHashrate),
                      "inline": true
                  },
                  {
                    "name": "有效的分享",
                    "value": item.validShares,
                    "inline": true
                  },
                  {
                    "name": "最後一次出現在",
                    "value": time2TimeAgo(item.lastSeen),
                    "inline": true
                  },
                ],
                //"author": {
                //    "name": "SFireW AI - Web Service - Snow",
                    //"url": "https://sfirew.com",
                //    "icon_url": "https://cdn.discordapp.com/avatars/581660507669266462/b21849df98e1d2125cca52e1064356b1.png?size=256"
                //},
                "footer": {
                    "text": "SFireW AI - 礦機模式",
                    "icon_url": "https://cdn.discordapp.com/avatars/581660507669266462/b21849df98e1d2125cca52e1064356b1.png?size=256"
                },
              }
            }
            msg.channel.send(workerEmbed)
          })
        } else {
          embed = getWorkerEmbed(
            'Ehtermine 礦機狀態',
            '沒有礦機在運作',
            '#f72828',
            `https://ethermine.org/miners/${miner_address}/dashboard`
          )
          msg.channel.send(embed)

        }

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

    } else if (msg.content === '!付款') {
      axios.get(`https://api.ethermine.org/miner/${miner_address}/payouts`)
      .then(function (response) {
        let data = response.data
        let embed = {}

        
        if(data.status === 'OK') {
          embed = getWorkerEmbed(
            '付款資訊',
            `${miner_address} 的付款紀錄`,
            '#32f728',
            `https://ethermine.org/miners/${miner_address}/worker/payout`
          )
          msg.channel.send(embed);

          // payout 列表
          data.data.forEach((item) => {
            let amount = new BigNumber(item.amount).multipliedBy(0.000000000000000001).toNumber()
            var paidDate = new Date(item.paidOn * 1000)

            let payoutEmbed = {
              embed: {
                "title": '已付款 ETH: ' + amount,
                "description": item.txHash,
                "url": `https://etherscan.io/tx/${item.txHash}`,
                "color": '#1c5fff',
                "timestamp": Date.now(),
                "fields": [
                  {
                    "name": "數量",
                    "value": amount,
                    "inline": true
                  },
                  {
                    "name": "付款日期",
                    "value": paidDate.toISOString(),
                    "inline": true
                  },
                ],
                //"author": {
                //    "name": "SFireW AI - Web Service - Snow",
                    //"url": "https://sfirew.com",
                //    "icon_url": "https://cdn.discordapp.com/avatars/581660507669266462/b21849df98e1d2125cca52e1064356b1.png?size=256"
                //},
                "footer": {
                    "text": "SFireW AI - 礦機模式",
                    "icon_url": "https://cdn.discordapp.com/avatars/581660507669266462/b21849df98e1d2125cca52e1064356b1.png?size=256"
                },
              }
            }
            msg.channel.send(payoutEmbed)
          })
          
        } else {
          embed = getWorkerEmbed(
            '付款資訊',
            '沒有資料',
            '#f72828',
            `https://ethermine.org/miners/${miner_address}/dashboard`
          )
          msg.channel.send(embed)
        }

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    }
  });


  /*
  // tail
  await tail.on('line', function(data) {
    //do something with data
    client.channels.cache.get('838313783931306045').send(data)
  });

  await tail.on("error", function(error) {
    console.log('ERROR: ', error);
  });*/

})()


let getWorkerEmbed = (title, description, color, url) => {
  return {
    embed: {
      "title": title,
      "description": description,
      "url": url,
      "color": color,
      "timestamp": Date.now(),
      /*
      "fields": [
          {
              "name": "URL",
              "value": req.url,
              "inline": true
          },
          {
              "name": "Method",
              "value": req.method,
              "inline": true
          },
          {
              "name": "Status Code",
              "value": codeRes,
              "inline": false
          },
          {
              "name": "User Agent",
              "value": req.headers['user-agent'],
              "inline": true
          },
          {
              "name": "使用者 IP",
              "value": user_ip,
              "inline": true
          },
      ],*/
      //"author": {
      //    "name": "SFireW AI - Web Service - Snow",
          //"url": "https://sfirew.com",
      //    "icon_url": "https://cdn.discordapp.com/avatars/581660507669266462/b21849df98e1d2125cca52e1064356b1.png?size=256"
      //},
      "footer": {
          "text": "SFireW AI - 礦機模式",
          "icon_url": "https://cdn.discordapp.com/avatars/581660507669266462/b21849df98e1d2125cca52e1064356b1.png?size=256"
      },
    }
  }
}


let timeConverter = (UNIX_timestamp) => {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

let time2TimeAgo = (ts) => {
  // This function computes the delta between the
  // provided timestamp and the current time, then test
  // the delta for predefined ranges.

  var d=new Date();  // Gets the current time
  var nowTs = Math.floor(d.getTime()/1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
  var seconds = nowTs-ts;

  // more that two days
  if (seconds > 2*24*3600) {
     return "幾天前";
  }
  // a day
  if (seconds > 24*3600) {
     return "昨天";
  }

  if (seconds > 3600) {
     return "幾小時前";
  }
  if (seconds > 1800) {
     return "半小時前";
  }
  if (seconds > 60) {
     return Math.floor(seconds/60) + "分鐘前";
  }
}