import {exec} from 'child_process';
import {promisify} from 'util';

// makemkvcon -r mkv disc:0 0 "G:/Video" && echo 'Ripping done!'
// handbrake -i "G:/Video/A1_t00.mkv" -o "//TRUENAS/media/movies/Lady and the Tramp.mp4" --preset "Fast 1080p30"

const execAsync = promisify(exec);

export async function openDisc(discDrive: number): Promise<string> {
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
        const format = videoFormat.toLowerCase() === 'mkv' ? 'mkv' : 'mp4';
        const commandRip = `${makemkvPath} mkv disc:${discDrive} 0 "${outputPath}" && echo 'Ripping done!'`;
        const { stdout, stderr } = await execAsync(commandRip);
        const commandCompress = `${handbrakePath} -i "${outputPath}/A1_t00.mkv" -o "${movieFinalLocation}/${movieTitle} (${movieYear}).mp4" --preset "Fast 1080p30" && echo 'Compression done!'`;
        const { stdout: compressStdout, stderr: compressStderr } = await execAsync(commandCompress);
        console.log('Rip Output:', stdout);
        return {stdout, compressStdout} ;
    } catch (error) {
        console.error('Error ripping disc:', error);
        throw error;
    }
}

export async function ejectDisc(discDrive: number) {
    try{
        const { stdout, stderr } = await execAsync(`makemkvcon -r eject disc:${discDrive}`);
        console.log('Eject Output:', stdout);
    } catch (error) {
        console.error('Error ejecting disc:', error);
        throw error;
    }
}



export async function compressVideo(inputPath: string, outputPath: string, handbrakePath: string) {
    try {
        const command = `${handbrakePath} -i "${inputPath}" -o "${outputPath}" --preset "Fast 1080p30" && echo 'Compression done!'`;
        const { stdout, stderr } = await execAsync(command);
        console.log('Compression Output:', stdout);
        return stdout;
    } catch (error) {
        console.error('Error compressing video:', error);
        throw error;
    }
}