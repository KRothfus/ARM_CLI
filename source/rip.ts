import {exec} from 'child_process';
import {promisify} from 'util';

// makemkvcon -r mkv disc:0 0 "G:/Video" && echo 'Ripping done!'
// handbrake -i "G:/Video/A1_t00.mkv" -o "//TRUENAS/media/movies/Lady and the Tramp.mp4" --preset "Fast 1080p30"

const execAsync = promisify(exec);

export async function openDisc(discDrive: number) {
    try {
        const { stdout, stderr } = await execAsync(`makemkvcon -r info disc:${discDrive}`);
        console.log('Movie Info:', stdout);
        return stdout;
    } catch (error) {
        console.error('Error fetching movie info:', error);
        throw error;
    }
}

export async function ripDisc(movieTitle, movieYear, discDrive, makemkvPath, handbrakePath, outputPath, videoFormat, movieFinalLocation){
    try {
        const command = `makemkvcon mkv disc:${discDrive} 0 "${movieFinalLocation}"`;
        const { stdout, stderr } = await execAsync(command);
        console.log('Rip Output:', stdout);
        return stdout;
    } catch (error) {
        console.error('Error ripping disc:', error);
        throw error;
    }
}

