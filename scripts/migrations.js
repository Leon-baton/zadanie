const { execSync } = require('child_process');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const postgresConfigPath = path.resolve(__dirname, '../src/common/modules/database/postgres.config.ts');
const configExists = fs.existsSync(postgresConfigPath);

if (!configExists) {
    console.error('Postgres config not found at:', postgresConfigPath);
    process.exit(1);
}

inquirer
    .prompt([
        {
            type: 'list',
            name: 'command',
            message: 'Select a command:',
            choices: ['migration:generate', 'migration:run', 'migration:revert'],
        },
        {
            type: 'input',
            name: 'migrationName',
            message: 'Enter migration name (if applicable):',
            when: (answers) => answers.command === 'migration:generate',
        },
    ])
    .then(({ command, migrationName }) => {
        const migrationsDir = path.resolve(__dirname, '../migrations');
        if (!fs.existsSync(migrationsDir)) {
            fs.mkdirSync(migrationsDir, { recursive: true });
        }

        const migrationPath = path.join(migrationsDir, `${migrationName}_migration`);
        const ormConfigPath = path.resolve(__dirname, '../dist/src/common/modules/database/postgres.config.js');

        let typeormCommand;
        if (command === 'migration:generate') {
            typeormCommand = `npm run build && node --require ts-node/register ./node_modules/typeorm/cli.js migration:generate -d "${ormConfigPath}" "${migrationPath}"`;
        } else {
            typeormCommand = `npm run build && node --require ts-node/register ./node_modules/typeorm/cli.js -d "${ormConfigPath}" "${command}"`;
        }

        console.log('Executing:', typeormCommand);
        try {
            execSync(typeormCommand, {
                stdio: 'inherit',
                cwd: path.resolve(__dirname, '..'),
            });
        } catch (err) {
            console.error('Error executing TypeORM command:', err.message);
            process.exit(1);
        }
    });
