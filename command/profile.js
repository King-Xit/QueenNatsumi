/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const Asena = require('../control');
const {MessageType} = require('queen-natsumi-web-api');
const Build = require('../Build');

const fs = require('fs');
const Language = require('../language');
const Lang = Language.getString('profile');

Asena.addCommand({Pnatsumi: 'kickme$', fromMe: true, desc: Lang.KICKME_DESC, onlyGroup: true}, (async (message, match) => {
    if (Build.KICKMEMSG == 'default') { 
        await message.client.sendMessage(message.jid,Lang.KICKME,MessageType.text);
        await message.client.groupLeave(message.jid);
    }
    else {
        await message.client.sendMessage(message.jid,Build.KICKMEMSG,MessageType.text);
        await message.client.groupLeave(message.jid);
    }
}));

Asena.addCommand({Pnatsumi: 'pp$', fromMe: true, desc: Lang.PP_DESC}, (async (message, match) => {    
    if (!message.reply_message || !message.reply_message.image) return await message.client.sendMessage(message.jid,Lang.NEED_PHOTO, MessageType.text);
    
    var load = await message.client.sendMessage(message.jid,Lang.PPING,MessageType.text);
    var location = await message.client.downloadAndSaveMediaMessage({
        key: {
            remoteJid: message.reply_message.jid,
            id: message.reply_message.id
        },
        message: message.reply_message.data.quotedMessage
    });

    await message.client.updateProfilePicture(message.client.user.jid, fs.readFileSync(location));
    await message.client.deleteMessage(message.jid, {id: load.key.id, remoteJid: message.jid, fromMe: true})
}));

Asena.addCommand({Pnatsumi: 'block ?(.*)', fromMe: true, desc: Lang.BLOCK_DESC}, (async (message, match) => {   
    if (Build.BLOCKMSG == 'default') {  
        if (message.reply_message !== false) {
            await message.client.sendMessage(message.jid, '@' + message.reply_message.jid.split('@')[0] + '```, ' + Lang.BLOCKED + '!```', MessageType.text, {
                quotedMessage: message.reply_message.data, contextInfo: {mentionedJid: [message.reply_message.jid.replace('c.us', 's.whatsapp.net')]}
            });
            await message.client.blockUser(message.reply_message.jid, "add");
        } else if (message.mention !== false) {
            message.mention.map(async user => {
                await message.client.sendMessage(message.jid, '@' + user.split('@')[0] + '```, ' + Lang.BLOCKED + '!```', MessageType.text, {
                    previewType: 0, contextInfo: {mentionedJid: [user.replace('c.us', 's.whatsapp.net')]}
                });
                await message.client.blockUser(user, "add");
            });
        } else if (!message.jid.includes('-')) {
            await message.client.sendMessage(message.jid, '*' + Lang.BLOCKED_UPPER + '*', MessageType.text);
            await message.client.blockUser(message.jid, "add");
        } else {
            await message.client.sendMessage(message.jid, '*' + Lang.NEED_USER + '*', MessageType.text);
        }
    }
    else {  
        if (message.reply_message !== false) {
            await message.client.sendMessage(message.jid, '@' + message.reply_message.jid.split('@')[0] + Build.BLOCKMSG, MessageType.text, {
                quotedMessage: message.reply_message.data, contextInfo: {mentionedJid: [message.reply_message.jid.replace('c.us', 's.whatsapp.net')]}
            });
            await message.client.blockUser(message.reply_message.jid, "add");
        } else if (message.mention !== false) {
            message.mention.map(async user => {
                await message.client.sendMessage(message.jid, '@' + user.split('@')[0] + Build.BLOCKMSG, MessageType.text, {
                    previewType: 0, contextInfo: {mentionedJid: [user.replace('c.us', 's.whatsapp.net')]}
                });
                await message.client.blockUser(user, "add");
            });
        } else if (!message.jid.includes('-')) {
            await message.client.sendMessage(message.jid, '*' + Lang.BLOCKED_UPPER + '*', MessageType.text);
            await message.client.blockUser(message.jid, "add");
        } else {
            await message.client.sendMessage(message.jid, '*' + Lang.NEED_USER + '*', MessageType.text);
        }
    }
}));

Asena.addCommand({Pnatsumi: 'unblock ?(.*)', fromMe: true, desc: Lang.UNBLOCK_DESC}, (async (message, match) => { 
    if (Build.UNBLOCKMSG == 'default') { 
   
        if (message.reply_message !== false) {
            await message.client.blockUser(message.reply_message.jid, "remove");
            await message.client.sendMessage(message.jid, '@' + message.reply_message.jid.split('@')[0] + '```, ' + Lang.UNBLOCKED + '!```', MessageType.text, {
                quotedMessage: message.reply_message.data, contextInfo: {mentionedJid: [message.reply_message.jid.replace('c.us', 's.whatsapp.net')]}
            });
        } else if (message.mention !== false) {
            message.mention.map(async user => {
                await message.client.blockUser(user, "remove");
                await message.client.sendMessage(message.jid, '@' + user.split('@')[0] + '```, ' + Lang.UNBLOCKED + '!```', MessageType.text, {
                    contextInfo: {mentionedJid: [user.replace('c.us', 's.whatsapp.net')]}
                });    
            });
        } else if (!message.jid.includes('-')) {
            await message.client.blockUser(message.jid, "remove");
            await message.client.sendMessage(message.jid, '*' + Lang.UNBLOCKED_UPPER + '*', MessageType.text,);
        } else {
            await message.client.sendMessage(message.jid, '*' + Lang.NEED_USER + '*', MessageType.text,);
        }
    }
    else {
        if (message.reply_message !== false) {
            await message.client.blockUser(message.reply_message.jid, "remove");
            await message.client.sendMessage(message.jid, '@' + message.reply_message.jid.split('@')[0] + Build.UNBLOCKMSG, MessageType.text, {
                quotedMessage: message.reply_message.data, contextInfo: {mentionedJid: [message.reply_message.jid.replace('c.us', 's.whatsapp.net')]}
            });
        } else if (message.mention !== false) {
            message.mention.map(async user => {
                await message.client.blockUser(user, "remove");
                await message.client.sendMessage(message.jid, '@' + user.split('@')[0] + Build.UNBLOCKMSG, MessageType.text, {
                    contextInfo: {mentionedJid: [user.replace('c.us', 's.whatsapp.net')]}
                });    
            });
        } else if (!message.jid.includes('-')) {
            await message.client.blockUser(message.jid, "remove");
            await message.client.sendMessage(message.jid, '*' + Lang.UNBLOCKED_UPPER + '*', MessageType.text,);
        } else {
            await message.client.sendMessage(message.jid, '*' + Lang.NEED_USER + '*', MessageType.text,);
        }
    }
}));

if (Build.WORKTYPE == 'private') {

    Asena.addCommand({Pnatsumi: 'jid ?(.*)', fromMe: true, desc: Lang.JID_DESC}, (async (message, match) => {    
        if (message.reply_message !== false) {
            await message.client.sendMessage(message.jid, Lang.JID.format(message.reply_message.jid.split('@')[0], message.reply_message.jid), MessageType.text, {
                quotedMessage: message.reply_message.data, contextInfo: {mentionedJid: [message.reply_message.jid.replace('c.us', 's.whatsapp.net')]}
            });
        } else if (message.mention !== false) {
            message.mention.map(async user => {
                await message.client.sendMessage(message.jid, Lang.JID.format(user.split('@')[0], user), MessageType.text, {
                    contextInfo: {mentionedJid: [user.replace('c.us', 's.whatsapp.net')]}
                });    
            });
        } else {
            await message.client.sendMessage(message.jid, Lang.JID_CHAT.format(message.jid), MessageType.text);
        }
    }));
}
else if (Build.WORKTYPE == 'public') {

    Asena.addCommand({Pnatsumi: 'jid ?(.*)', fromMe: false, desc: Lang.JID_DESC}, (async (message, match) => {    
        if (message.reply_message !== false) {
            await message.client.sendMessage(message.jid, Lang.JID.format(message.reply_message.jid.split('@')[0], message.reply_message.jid), MessageType.text, {
                quotedMessage: message.reply_message.data, contextInfo: {mentionedJid: [message.reply_message.jid.replace('c.us', 's.whatsapp.net')]}
            });
        } else if (message.mention !== false) {
            message.mention.map(async user => {
                await message.client.sendMessage(message.jid, Lang.JID.format(user.split('@')[0], user), MessageType.text, {
                    contextInfo: {mentionedJid: [user.replace('c.us', 's.whatsapp.net')]}
                });    
            });
        } else {
            await message.client.sendMessage(message.jid, Lang.JID_CHAT.format(message.jid), MessageType.text);
        }
    }));
}
