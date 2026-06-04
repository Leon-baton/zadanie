const { execSync } = require('child_process');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const seederConfigPath = path.resolve(__dirname, '../src/common/modules/database/seeder.config.ts');
const configExists = fs.existsSync(seederConfigPath);

if (!configExists) {
    console.error('Seeder config not found at:', seederConfigPath);
    process.exit(1);
}

inquirer
    .prompt([
        {
            type: 'list',
            name: 'command',
            message: 'Select a command:',
            choices: ['seed:create', 'seed:run', 'seed:revert'],
        },
        {
            type: 'input',
            name: 'seedName',
            message: 'Enter seed name (if applicable):',
            when: (answers) => answers.command === 'seed:create',
        },
    ])
    .then(({ command, seedName }) => {
        const seedsDir = path.resolve(__dirname, '../seeds');
        if (!fs.existsSync(seedsDir)) {
            fs.mkdirSync(seedsDir, { recursive: true });
        }

        const seedPath = path.join(seedsDir, `${seedName}_seed`);
        const configPath = path.resolve(__dirname, '../dist/src/common/modules/database/seeder.config.js');

        let typeormCommand;
        if (command === 'seed:create') {
            typeormCommand = `npm run build && node --require ts-node/register ./node_modules/typeorm/cli.js migration:create "${seedPath}"`;
        } else {
            typeormCommand = `npm run build && node --require ts-node/register ./node_modules/typeorm/cli.js -d "${configPath}" "${command.replace('seed:', 'migration:')}"`;
        }

        console.log('Executing:', typeormCommand);
        try {
            execSync(typeormCommand, {
                stdio: 'inherit',
                cwd: path.resolve(__dirname, '..'),
            });
        } catch (err) {
            console.error('Error executing seeder command:', err.message);
            process.exit(1);
        }
    });
