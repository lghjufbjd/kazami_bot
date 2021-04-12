const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'Njc0NDIwNzI1MTQxOTk1NTcw.XjoanQ.QaXnDIOtw4VT29upjeNBIk_Mtdo';

const PREFIX = "!";
const ytdl = require('ytdl-core');

bot.on('ready', ()=> {
    console.log('stopa siema')
})
const queue = new Map();

async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('Wejdz na kanal aby puścić muzyczke');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('coś sie zbugowało ');
	}

	const songInfo = await ytdl.getInfo(args[1]);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} został dodany do kolejki`);
	}

}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('Wejdz na kanal aby zastopowac muzyczke');
	if (!serverQueue) return message.channel.send('Nie ma czego skipowac!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('Wejdz na kanal aby puścić muzyczke');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Koniec muzyczki');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
bot.on('message', message=>{
    let args = message.content.substring(PREFIX.length).split(" ");
    switch (args[0])
    {
        case 'help':
            const embed = new Discord.RichEmbed()
            .setTitle('Pomoc')
            .addField('Komendy: \n !kocham\n !dajszopa\n !play\n !skip\n !stop\n !dajSwojaFote')
            .setImage('https://external-preview.redd.it/F1C4LYhgJ9NAvhNbzL7amwOA_ngUrZwMMr9K4FQ0IwI.png?auto=webp&s=7326cc0d9c351100fa31f31d67a30afcb30cd9dd')
            .setColor(0xF1C40F)
            message.channel.sendEmbed(embed);
        break;
	case 'dajSwojaFote':
            message.reply('.hentaibomb oshino shinobu');
        break;
        case 'kocham':
            message.reply('cię');
        break;
        case 'play':
            execute(message, serverQueue);
        break;
        case 'stop':
            stop(message, serverQueue);

        break;
        case 'skip':
            skip(message, serverQueue);
        break;
        case 'dajszopa':
            switch (Math.floor(Math.random() * 11))
            {
                case 1:
                    message.reply('https://www.riverbender.com/articles/images/11041994416-Racoon.png')
                break;
                case 2:
                    message.reply('https://thenypost.files.wordpress.com/2019/03/rabid-raccoons-are-turning-up-all-over-nyc.jpg?quality=80&strip=all&w=618&h=410&crop=1')
                break;
                case 3:
                    message.reply('https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F11fb3572-7380-11e7-8eac-856e9b33761e.jpg?crop=3000%2C1687%2C0%2C156&resize=412')
                break;
                case 4:
                    message.reply('https://4.bp.blogspot.com/-msPCsm3Dt5g/XFdjRv1oyrI/AAAAAAABRZs/0OC5uXc6ZBk-bHn3smBTfZNgHW8RJzSGgCKgBGAs/s1600/IMG_8909.jpg')
                break;
                case 5:
                    message.reply('https://cdni.rt.com/files/2018.07/article/5b58a15dfc7e93a57c8b45d5.jpg')
                break;
                case 6:
                    message.reply('https://t1.ea.ltmcdn.com/en/images/1/7/9/img_racoons_as_pets_guidelines_and_tips_971_paso_2_600.jpg')
                break;
                case 7:
                    message.reply('https://live.staticflickr.com/675/32316514815_e46bf2fe8e_b.jpg')
                break;
                case 8:
                    message.reply('https://live.staticflickr.com/2036/2124864882_7f86885210_b.jpg')
                break;
                case 9:
                    message.reply('https://previews.123rf.com/images/ross31/ross310711/ross31071100005/2138442-racoons.jpg')
                break;
                case 10:
                    message.reply('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR6Y2hxsqC8zDklzROPXxcWbeC82cSEqmqFJj8H9C5XvnRTvwzb')
                break;
            }
            
        break;
    }
})

bot.login(token)
