process.env.NODE_ENV = 'production'

;(() => {
    if (!config.discordWebhookUrl)
        return

    const path = `${GetResourcePath(config.resourceName)}/storage/videos`
    const fs = require('fs')
    const request = require('request')

    on('cs-stories:upload', entry => {
        request.post({
            url: config.discordWebhookUrl,

            formData: {
                file: fs.createReadStream(`${path}/${entry.uuid}.webm`),

                payload_json: JSON.stringify({
                    content: 'A new story has been uploaded!',

                    username: 'cs-stories',
                    avatar_url: 'https://files.criticalscripts.shop/brand-assets/favicon.png',

                    embeds: [
                        {
                            type: 'rich',
                            title: 'Story Data',
                            description: `UUID \`${entry.uuid}\``,
                            color: 0xff0037,

                            fields: [
                                {
                                    name: 'Author',
                                    value: `**${entry.author}** (\`${entry.license}\`)`,
                                    inline: false
                                },

                                {
                                    name: 'Location',
                                    value: `_${entry.location.x.toFixed(8)}, ${entry.location.y.toFixed(8)}, ${entry.location.z.toFixed(8)}_`,
                                    inline: false
                                }
                            ],

                            footer: {
                                text: 'Critical Scripts',
                                icon_url: 'https://files.criticalscripts.shop/brand-assets/favicon.png'
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
