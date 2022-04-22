process.env.NODE_ENV = 'production'

;(() => {
    on('cs-stories:ready', (resourceName, external) => {
        if (!config.discordWebhookUrl)
            return

        let globalViewKey = null

        const path = `${GetResourcePath(resourceName)}/storage/videos`
        const fs = require('fs')
        const request = require('request')

        if (external)
            globalViewKey = (require('crypto')).createHash('sha256').update(external.key).digest('hex')

        on('cs-stories:upload', entry => {
            // The "entry.friendlyLocation" comes from the player's client and cannot be verified for its contents nor it is guaranteed to be a location.
            // If you end up using this resource as a feed (which you should not; it's supposed to be used for moderation), you'd probably want to verify this against whatever the player's client may legitimately send (e.g. zone names).

            request.post({
                url: config.discordWebhookUrl,

                formData: {
                    file: external ? null : fs.createReadStream(`${path}/${entry.uuid}.webm`),

                    payload_json: JSON.stringify({
                        content: `A new story has been uploaded!${external ? ` ${external.url}video/${globalViewKey}/${entry.uuid}.webm` : ''}`,

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
                                        value: `_${entry.author}_ (\`${entry.license}\`)`,
                                        inline: false
                                    },

                                    {
                                        name: 'Location',
                                        value: `\`${entry.location.x.toFixed(8)}\`, \`${entry.location.y.toFixed(8)}\`, \`${entry.location.z.toFixed(8)}\``,
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
                    console.error('[cs-stories-dw] Failed to post Discord webhook!', error)
            })
        })
    })

    emit('cs-stories-dw:ready')
}) ();
