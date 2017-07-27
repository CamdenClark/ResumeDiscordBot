function handleRoles(msg) {
    programmingRoles = ['C++', 'C', 'C#', 'Go', 'Haskell', 'Java', 'Javascript',
        'Objective-C', 'PHP', 'Python', 'Ruby', 'Scala', 'SQL', 'Swift'];

    seniorityRoles   = ['Student', 'Intern', 'Junior Developer', 'Mid-level Developer', 'Senior Developer'];

    var splitmsg = msg.content.split(" ");

    //output only
    function sendHelpRoles() {
        msg.reply(`
    Use "!role add [role]" to add a role.
    Use "!role remove [role]" to delete a role.
    Must be exactly as displayed.

    Don't abuse the programming language tags, please, be reasonable!
    Programming Language Roles:
        ${programmingRoles.join('\n        ')}
        
    You are only allowed one seniority role. Select the role that best reflects where you're at in your career.
    Seniority Roles:
        ${seniorityRoles.join('\n        ')}
        `);
    }

    function confirmAddedRole() {
        msg.reply(`added ${splitmsg[2]} to your roles.`);
    }

    function notValidRole() {
        msg.reply(`${splitmsg[2]} is not a valid role.`);
    }

    function duplicateRole() {
        msg.reply(`${splitmsg[2]} is already in your role list.`);
    }

    function duplicateSeniorityRole() {
        msg.reply(`you already have a seniority role.`);
    }

    //actions with output
    function removeRole(role) {
        msg.guild.fetchMember(msg.author).then((user) => {
            if (user.roles.array().includes(stringToRole(role)) && (programmingRoles.includes(role) || seniorityRoles.includes(role))) {
                user.removeRole(stringToRole(role)).then(() => {
                    msg.reply(`successfully removed role ${role}.`);
                }).catch(() => {
                    msg.reply(`failed to remove role ${role}.`);
                });
            } else if (!user.roles.array().includes(stringToRole(role))) {
                msg.reply(`The ${role} role is not currently assigned to you.`);
            }
        });
    }

    function clearRoles() {
        msg.guild.fetchMember(msg.author).then((user) => {
            user.roles.array().length = 0;
            msg.reply('successfully cleared all your roles');
        });
    }

    function viewRoles() {
        msg.guild.fetchMember(msg.author).then((user) => {
            msg.reply('Your current roles: ' + user.roles.array().toString());
        });
    }

    //internal use only
    function stringToRole(role) {
        const stringRoles = map(msg.guild.roles.array(), (i) => i.name);
        const index = stringRoles.indexOf(role);
        return msg.guild.roles.array()[index];
    }

    function seniorityRoleBlank(user) {
        return filter(seniorityRoles, (roleName) => user.roles.array().includes(stringToRole(roleName))).length === 0;
    }

    function addRole(role) {
        msg.guild.fetchMember(msg.author).then((user) => {
            if (user.roles.array().includes(stringToRole(role))) {
                duplicateRole();
            } else if (programmingRoles.includes(role)) {
                user.addRole(stringToRole(role)).then(() => {
                    confirmAddedRole();
                }).catch(() => {
                    msg.reply(`failed to add role ${role}.`);
                });
            } else if (seniorityRoles.includes(role)) {
                if (seniorityRoleBlank(user)) {
                    user.addRole(stringToRole(role)).then(() => {
                        confirmAddedRole();
                    }).catch(() => {
                        msg.reply(`failed to add role ${role}.`);
                    });
                } else {
                    duplicateSeniorityRole();
                }
            } else {
                notValidRole();
            }
        })
    }

    //parses input
    if ((msg.channel.name === "roles" ||  msg.channel.name === "bot-development") && msg.content.toLowerCase().startsWith('!role')) {
        if (splitmsg.length > 2) {
            splitmsg[2] = splitmsg.slice(2).join(" ")
            switch(splitmsg[1].toLowerCase()) {
                case 'add':
                    addRole(splitmsg[2]);
                    break;
                case 'remove':
                    removeRole(splitmsg[2]);
                    break;
                case 'clear':
                    clearRoles();
                    break;
                case 'view':
                    viewRoles();
                    break;
                default:
                    sendHelpRoles();
                    break;
            }
        } else {
            sendHelpRoles();
        }
    }
}