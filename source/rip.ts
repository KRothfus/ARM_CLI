import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

export async function getFiles() {
    try {
        const { stdout, stderr } = await execAsync('makemkvcon -r info disc:0');
        console.log('Movie Info:', stdout);
        return stdout;
    } catch (error) {
        console.error('Error fetching movie info:', error);
        throw error;
    }
}

export async function ripDisc(destinationFolder: string){
    try {
        const command = `makemkvcon mkv disc:0 all "${destinationFolder}"`;
        const { stdout, stderr } = await execAsync(command);
        console.log('Rip Output:', stdout);
        return stdout;
    } catch (error) {
        console.error('Error ripping disc:', error);
        throw error;
    }
}