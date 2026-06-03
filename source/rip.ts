import {exec, execFile, execFileSync} from 'child_process';
// Define DiscInfo type
type DiscInfo = {
    id: number;
    name: string;
    tracks: number;
};
import {promisify} from 'util';
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';


const envLocalPath = path.resolve(process.cwd(), '.env.local');
// makemkvcon -r mkv disc:0 0 "G:/Video" && echo 'Ripping done!'
// handbrake -i "G:/Video/A1_t00.mkv" -o "//TRUENAS/media/movies/Lady and the Tramp.mp4" --preset "Fast 1080p30"
dotenv.config({path: envLocalPath});
const execAsync = promisify(exec);
const MAKEMKV_KEY = process.env[`MAKEMKV_KEY`]

// export async function openDisc(discDrive: number): Promise<DiscInfo[]> {
//    try {
//         // --messages=-stdout forces the output to be readable
//         const { stdout } = await execAsync(`"${MAKEMKV_KEY}" -r info disc:${discDrive}`);
//         console.log(stdout);
        
//         // Custom parsing logic based on makemkvcon output would go here
//         return [{ id: 0, name: "Sample Disc", tracks: 5 }];
//     } catch (error) {
//         console.error("Failed to fetch disc info:", error);
//         return [];
//     }
// }

export async function openDisc(discDrive: number): Promise<string> {
    try {
        // Double-check your MAKEMKV_KEY path variable
        const { stdout } = await execAsync(`"${MAKEMKV_KEY}" -r info disc:${discDrive}`);
        
        // Return the raw stdout string for your handler to parse
        return stdout; 
    } catch (error: any) {
        // 2. Log out the full error structure to see why execution failed
        console.error("Exec failed details:", error.message || error);
        
        // Return an empty string so your component knows nothing was found
        return "";
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