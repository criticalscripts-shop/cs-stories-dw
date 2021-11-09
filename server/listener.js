/* Critical Scripts | https://criticalscripts.shop */

// This file is internal, do NOT edit it unless you know what you are doing.

;(() => {
    if (!config.discordWebhookUrl)
        return

    const path = `${GetResourcePath(config.resourceName)}/storage`
    const fs = require('fs')
    const request = require('request')

    on('cs-stories:upload', (identifiers, metadata, uuid) => {
        request.post({
            url: config.discordWebhookUrl,

            formData: {
                file: fs.createReadStream(`${path}/${uuid}.webm`),

                payload_json: JSON.stringify({
                    content: 'A new story has been uploaded!',

                    username: 'cs-stories',
                    avatar_url: 'https://files.criticalscripts.shop/images/favicon.png',

                    embeds: [
                        {
                            type: 'rich',
                            title: 'Story Data',
                            description: `UUID \`${uuid}\``,
                            color: 0xff0037,

                            fields: [
                                {
                                    name: 'Author',
                                    value: `**${metadata.author}**`,
                                    inline: true
                                },

                                {
                                    name: 'Identifier',
                                    value: `\`${identifiers.filter(v => v.startsWith(`${config.logIdentifier}:`))[0] || 'No Identifier'}\``,
                                    inline: true
                                },

                                {
                                    name: 'Location',
                                    value: `_${metadata.location.x.toFixed(8)}, ${metadata.location.y.toFixed(8)}, ${metadata.location.z.toFixed(8)}_`,
                                    inline: false
                                }
                            ],

                            footer: {
                                text: 'Critical Scripts',
                                icon_url: 'https://files.criticalscripts.shop/images/favicon.png'
                            }
                        }
                    ]
                })
            }
        }, (error, response, body) => {
            if (error)
                console.error(`[cs-stories-dw] Failed to post Discord webhook!`, error)
        })
    })
}) ();