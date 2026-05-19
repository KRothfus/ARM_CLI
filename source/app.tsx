import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import SelectInput from 'ink-select-input';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import TextInput from 'ink-text-input';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import path from 'path';
import {ripDisc} from './rip.js';

const OUTPUT_FOLDER = 'OUTPUT_FOLDER';
const VIDEO_FORMAT = 'VIDEO_FORMAT';
const SHOWS_FINAL_PATH = 'SHOWS_FINAL_PATH';
const MOVIES_FINAL_PATH = 'MOVIES_FINAL_PATH';
const MAKEMKV_PATH = 'MAKEMKV_PATH';
const HANDBRAKE_PATH = 'HANDBRAKE_PATH';

dotenv.config({path: '.env.local'});
const ENV_PATH = path.resolve(process.cwd(), '.env.local');

// 1. Simple Type Definition
interface Item {
	label: string;
	value: string;
}

const saveToEnvFile = (key: string, value: string) => {
	let content = '';
	if (fs.existsSync(ENV_PATH)) {
		content = fs.readFileSync(ENV_PATH, 'utf8');
	}

	const lines = content.split('\n');
	const regex = new RegExp(`^${key}=`);
	let found = false;

	const newLines = lines.map(line => {
		if (regex.test(line)) {
			found = true;
			return `${key}="${value}"`; // Quote values to handle spaces
		}
		return line;
	});

	if (!found) {
		newLines.push(`${key}="${value}"`);
	}

	// Filter empty lines and join
	fs.writeFileSync(ENV_PATH, newLines.filter(Boolean).join('\n').trim() + '\n');
};

export default function App() {
	const [activeTab, setActiveTab] = useState('shows');
	const [isEditing, setIsEditing] = useState(false);
	const [outputPath, setOutputPath] = useState(process.env[OUTPUT_FOLDER]);
	const [editingOutputPath, setEditingOutputPath] = useState(false);
	const [editingVideoFormat, setEditingVideoFormat] = useState(false);
	const [videoFormat, setVideoFormat] = useState(process.env[VIDEO_FORMAT]);
	const [editingShowFinalFolder, setEditingShowFinalFolder] = useState(false);
	const [editingMovieFinalFolder, setEditingMovieFinalFolder] = useState(false);
	const [showsFinalLocation, setshowsFinalLocation] = useState(
		process.env[SHOWS_FINAL_PATH],
	);
	const [movieFinalLocation, setmovieFinalLocation] = useState(
		process.env[MOVIES_FINAL_PATH],
	);
	const [movieTitle, setMovieTitle] = useState('My Movie');
	const [editingMovieTitle, setEditingMovieTitle] = useState(false);
	const [movieYear, setMovieYear] = useState('2024');
	const [discDrive, setDiscDrive] = useState('0'); // Default to disc:0
	const [editingDiscDrive, setEditingDiscDrive] = useState(false);
	const [editingHandBrakePath, setEditingHandBrakePath] = useState(false);
	const [editingMakeMKVPath, setEditingMakeMKVPath] = useState(false);
	const [handbrakePath, setHandbrakePath] = useState(
		process.env[HANDBRAKE_PATH] || 'handbrake',
	);
	const [makemkvPath, setMakemkvPath] = useState(
		process.env[MAKEMKV_PATH] || 'makemkvcon',
	);
	let navItems: Item[] = [
		{label: '📺  Shows', value: 'shows'},
		{label: '🎬  Movies', value: 'movies'},
		{label: '🔧  Settings', value: 'settings'},
	];

	const handleSelect = (item: Item) => {
		if (item.value === 'settings') {
			setIsEditing(true);
			setActiveTab(item.value);
		} else if (item.value === 'shows') {
			setIsEditing(true);
			setActiveTab(item.value);
		} else {
			setIsEditing(true);
			setActiveTab(item.value);
		}
	};

	const handleShowsSelect = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setActiveTab('shows'); // Default back to shows tab
			navItems = [
				{label: '📺 Shows', value: 'shows'},
				{label: '🎬 Movies', value: 'movies'},
				{label: '🔧  Settings', value: 'settings'},
			]; // Restore original nav items
		}
	};

	const handleMoviesSelect = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setActiveTab('shows'); // Default back to shows tab
			navItems = [
				{label: '📺 Shows', value: 'shows'},
				{label: '🎬 Movies', value: 'movies'},
				{label: '🔧  Settings', value: 'settings'},
			]; // Restore original nav items
		}
	};

	const handleSettingsSelect = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setEditingOutputPath(false);
			setEditingVideoFormat(false);
			setEditingShowFinalFolder(false);
			setEditingMovieFinalFolder(false);
			setActiveTab('shows'); // Default back to shows tab
			navItems = [
				{label: '📺 Shows', value: 'shows'},
				{label: '🎬 Movies', value: 'movies'},
				{label: '🔧  Settings', value: 'settings'},
			]; // Restore original nav items
		}
		if (item.label.includes('Output Folder')) {
			setEditingOutputPath(true);
		}
		if (item.label.includes('Video Format')) {
			setEditingVideoFormat(true);
		}
		if (item.label.includes('Show Final Folder')) {
			setEditingShowFinalFolder(true);
		}
		if (item.label.includes('Movie Final Folder')) {
			setEditingMovieFinalFolder(true);
		}
		if (item.label.includes('Disc Drive')) {
			setEditingDiscDrive(true);
		}
		if (item.label.includes('HandBrakeCLI Path')) {
			setEditingHandBrakePath(true);
		}
		if (item.label.includes('MakeMKV Path')) {
			setEditingMakeMKVPath(true);
		}
	};

	const handleShowsSubmit = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setActiveTab('shows'); // Default back to shows tab
			navItems = [
				{label: '📺 Shows', value: 'shows'},
				{label: '🎬 Movies', value: 'movies'},
				{label: '🔧  Settings', value: 'settings'},
			]; // Restore original nav items
		}
	};

	const handleMoviesSubmit = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setActiveTab('movies'); // Default back to shows tab
			navItems = [
				{label: '📺 Shows', value: 'shows'},
				{label: '🎬 Movies', value: 'movies'},
				{label: '🔧  Settings', value: 'settings'},
			]; // Restore original nav items
		}
	};

	const handleSettingSubmit = (item: Item) => {
		if (item.label.includes('Output Folder')) {
			setOutputPath(outputPath); // Update state
			process.env[OUTPUT_FOLDER] = outputPath; // Update process.env for current session
			saveToEnvFile(OUTPUT_FOLDER, outputPath); // Update .env.local
			setEditingOutputPath(false);
		}
		if (item.label.includes('Video Format')) {
			setVideoFormat(videoFormat); // Update state
			process.env[VIDEO_FORMAT] = videoFormat; // Update process.env for current session
			saveToEnvFile(VIDEO_FORMAT, videoFormat); // Update .env.local
			setEditingVideoFormat(false);
		}
		if (item.label.includes('Show Final Folder')) {
			setshowsFinalLocation(showsFinalLocation); // Update state
			process.env[SHOWS_FINAL_PATH] = showsFinalLocation; // Update process.env for current session
			saveToEnvFile(SHOWS_FINAL_PATH, showsFinalLocation); // Update .env.local
			setEditingShowFinalFolder(false);
		}
		if (item.label.includes('Movie Final Folder')) {
			setmovieFinalLocation(movieFinalLocation); // Update state
			process.env[MOVIES_FINAL_PATH] = movieFinalLocation; // Update process.env for current session
			saveToEnvFile(MOVIES_FINAL_PATH, movieFinalLocation); // Update .env.local
			setEditingMovieFinalFolder(false);
		}
		if (item.label.includes('Disc Drive')) {
			setDiscDrive(discDrive); // Update state
			process.env[`DISC_DRIVE`] = discDrive; // Update process.env for current session
			saveToEnvFile(`DISC_DRIVE`, discDrive); // Update .env.local
			setEditingDiscDrive(false);
		}
		if (item.label.includes('HandBrakeCLI Path')) {
			setHandbrakePath(handbrakePath); // Update state
			process.env[HANDBRAKE_PATH] = handbrakePath; // Update process.env for current session
			saveToEnvFile(HANDBRAKE_PATH, handbrakePath); // Update .env.local
			setEditingHandBrakePath(false);
		}
		if (item.label.includes('MakeMKV Path')) {
			setMakemkvPath(makemkvPath); // Update state
			process.env[MAKEMKV_PATH] = makemkvPath; // Update process.env for current session
			saveToEnvFile(MAKEMKV_PATH, makemkvPath); // Update .env.local
			setEditingMakeMKVPath(false);
		}
	};
	return (
		<Box flexDirection="row" padding={1} width="100%">
			{/* SIDEBAR */}
			<Box borderStyle="single" width={30} flexDirection="column" paddingX={1}>
				<Text color="cyan" bold>
					{' '}
					DVD RIPPER{' '}
				</Text>
				<Box marginTop={1}>
					<SelectInput
						isFocused={!isEditing}
						items={navItems}
						onSelect={handleSelect}
					/>
				</Box>
			</Box>

			{/* MAIN CONTENT */}
			<Box
				flexGrow={1}
				borderStyle="single"
				paddingX={2}
				flexDirection="column"
			>
				<Box flexDirection="column" flexGrow={1}>
					{activeTab === 'shows' && (
						<Box marginTop={1}>
							<View
								title="SHOWS"
								color="rainbow"
								desc="Ready to rip feature film..."
							/>
							<Text color="yellow">
								⚠️ Show ripping is experimental. Use with caution.
							</Text>
						</Box>
					)}
					{activeTab === 'movies' && (
						<Box flexDirection="column" width="100%">
							<Box
								borderStyle="single"
								justifyContent="center"
								width="100%"
								marginBottom={1}
							>
								<Text bold color="cyan">
									{' '}
									Movies{' '}
								</Text>
							</Box>
							{editingMovieTitle ? (
								<Box>
									<Text>Movie Title: </Text>
									<TextInput
										value={movieTitle}
										onChange={setMovieTitle}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Movie Title: ${movieTitle}`,
												value: movieTitle,
											})
										}
									/>
								</Box>
							) : editingOutputPath ? (
								<Box>
									<Text>Output Folder: </Text>
									{/* <TextInput
										value={outputPath}
										onChange={setOutputPath}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Output Folder: ${outputPath}`,
												value: outputPath,
											})
										}
									/> */}
								</Box>
							) : editingVideoFormat ? (
								<Box>
									<Text>Video Format: </Text>
									<TextInput
										value={videoFormat}
										onChange={setVideoFormat}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Video Format: ${videoFormat}`,
												value: videoFormat,
											})
										}
									/>
								</Box>
							) : editingMovieFinalFolder ? (
								<Box>
									<Text> Movie Final Folder: </Text>
									<TextInput
										value={movieFinalLocation}
										onChange={setmovieFinalLocation}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Movie Final Folder: ${movieFinalLocation}`,
												value: movieFinalLocation,
											})
										}
									/>
								</Box>
							) : (
								<SelectInput
									isFocused={activeTab === 'movies'}
									items={[
										{
											label: `Movie Title: ${movieTitle}`,
											value: movieTitle,
										},
										{
											label: `Movie Final Folder: ${movieFinalLocation}`,
											value: movieFinalLocation,
										},
										{label: 'Movie Year: ${movieYear}', value: `${movieYear}`},
										{
											label: 'RIP!',
											value: 'ripIT!',
										},
										{label: '🔙 Back', value: 'back'},
									]}
									onSelect={handleSettingsSelect}
								/>
							)}
						</Box>
					)}
					{activeTab === 'settings' && (
						<Box flexDirection="column" width="100%">
							<Box
								borderStyle="single"
								justifyContent="center"
								width="100%"
								marginBottom={1}
							>
								<Text bold color="cyan">
									{' '}
									SETTINGS{' '}
								</Text>
							</Box>
							{editingOutputPath ? (
								<Box>
									<Text>Output Folder: </Text>
									<TextInput
										value={outputPath}
										onChange={setOutputPath}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Output Folder: ${outputPath}`,
												value: outputPath,
											})
										}
									/>
								</Box>
							) : editingVideoFormat ? (
								<Box>
									<Text>Video Format: </Text>
									<TextInput
										value={videoFormat}
										onChange={setVideoFormat}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Video Format: ${videoFormat}`,
												value: videoFormat,
											})
										}
									/>
								</Box>
							) : editingShowFinalFolder ? (
								<Box>
									<Text>Show Final Folder: </Text>
									<TextInput
										value={showsFinalLocation}
										onChange={setshowsFinalLocation}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Show Final Folder: ${showsFinalLocation}`,
												value: showsFinalLocation,
											})
										}
									/>
								</Box>
							) : editingMovieFinalFolder ? (
								<Box>
									<Text> Movie Final Folder: </Text>
									<TextInput
										value={movieFinalLocation}
										onChange={setmovieFinalLocation}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Movie Final Folder: ${movieFinalLocation}`,
												value: movieFinalLocation,
											})
										}
									/>
								</Box>
							) : editingDiscDrive ? (
								<Box>
									<Text>Disc Drive Index: </Text>
									<TextInput
										value={discDrive}
										onChange={setDiscDrive}
										onSubmit={() =>
											handleSettingSubmit({
												label: `Disc Drive Index: ${discDrive}`,
												value: discDrive,
											})
										}
									/>
								</Box>
							) : editingHandBrakePath ? (
								<Box>
									<Text>HandBrakeCLI Path: </Text>
									<TextInput
										value={handbrakePath}
										onChange={setHandbrakePath}
										onSubmit={() =>
											handleSettingSubmit({
												label: `HandBrakeCLI Path: ${handbrakePath}`,
												value: handbrakePath,
											})
										}
									/>
								</Box>
							) : editingMakeMKVPath ? (
								<Box>
									<Text>MakeMKV Path: </Text>
									<TextInput
										value={makemkvPath}
										onChange={setMakemkvPath}
										onSubmit={() =>
											handleSettingSubmit({
												label: `MakeMKV Path: ${makemkvPath}`,
												value: makemkvPath,
											})
										}
									/>
								</Box>
							) : (
								<SelectInput
									isFocused={activeTab === 'settings'}
									items={[
										{
											label: `Output Folder: ${outputPath}`,
											value: outputPath,
										},
										{label: `Video Format: ${videoFormat}`, value: 'format'},
										{
											label: `Show Final Folder: ${showsFinalLocation}`,
											value: showsFinalLocation,
										},
										{
											label: `Movie Final Folder: ${movieFinalLocation}`,
											value: movieFinalLocation,
										},
										{
											label: `Disc Drive Index: ${discDrive}`,
											value: `disc:${discDrive}`,
										},
										{
											label: `HandBrakeCLI Path: ${handbrakePath}`,
											value: `${handbrakePath}`,
										},
										{
											label: `MakeMKV Path: ${makemkvPath}`,
											value: `${makemkvPath}`,
										},
										{label: '🔙', value: 'back'},
									]}
									onSelect={handleSettingsSelect}
								/>
							)}
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
}

// A single reusable View component to replace ContentPaneOne/Two
type ValidGradientName =
	| 'retro'
	| 'rainbow'
	| 'atlas'
	| 'cristal'
	| 'teen'
	| 'mind';

function View({
	title,
	color,
	desc,
}: {
	title: string;
	color: ValidGradientName;
	desc: string;
}) {
	return (
		<Box flexDirection="column" width="100%">
			<Box width="100%" overflow="hidden">
				<Gradient name={color}>
					<BigText text={title} font="tiny" />
				</Gradient>
				<Text italic color="gray">
					{desc}
				</Text>
			</Box>
		</Box>
	);
}
