import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import SelectInput from 'ink-select-input';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import TextInput from 'ink-text-input';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import path from 'path';
import {openDisc, ripDisc} from './rip.js';
import {parse} from 'node:path';

const OUTPUT_FOLDER = 'OUTPUT_FOLDER';
const VIDEO_FORMAT = 'VIDEO_FORMAT';
const SHOWS_FINAL_PATH = 'SHOWS_FINAL_PATH';
const MOVIES_FINAL_PATH = 'MOVIES_FINAL_PATH';
const MAKEMKV_PATH = 'MAKEMKV_PATH';
const HANDBRAKE_PATH = 'HANDBRAKE_PATH';
const envTemplatePath = path.resolve(process.cwd(), '.env.template');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

if (!fs.existsSync(envTemplatePath)) {
	fs.writeFileSync(
		envTemplatePath,
		'# Add your default template keys here\nPORT=3000\n',
	);
	console.log('.env.template created with default content.');
}

try {
	fs.copyFileSync(envTemplatePath, envLocalPath, fs.constants.COPYFILE_EXCL);
	console.log('.env.local created from .env.template');
} catch (error: any) {
	if (error.code === 'EEXIST') {
		console.log('.env.local already exists, skipping creation.');
	} else {
		console.error('Error copying to .env.local:', error);
	}
}

const result = dotenv.config({path: envLocalPath});

if (result.error) {
	console.error('Error loading .env.local:', result.error);
} else {
	console.log('.env.local loaded successfully.');
}
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

function discContentHandler(discContent: string) {
	return discContent.split('\n').map(line => {
		const match = line.match(/^\s*Title\s+(\d+):\s+(.*)$/);
		if (match) {
			const titleNumber = match[1];
			const titleName = match[2];
			console.log(`Title ${titleNumber}: ${titleName}`);
		}
	});
}

// const RipMovie =  () => {
// 	// Mark this callback as async to allow the use of await inside it
// 	let handledDiscContent = [];

// 	const discContent =  openDisc(0).catch(error => {
// 		console.error('Error opening disc:', error);
// 	});

// 	// const discContent = await openDisc(0).catch(error => {
// 	// 	console.error('Error opening disc:', error);
// 	// });

// 	if (typeof discContent === 'string') {
// 		handledDiscContent = discContentHandler(discContent);
// 	}

// 	return (
// 		<Box flexDirection="column" padding={1}>
// 			<Text color="green">Ripping in progress...</Text>
// 			<Text color="yellow">
// 				This may take a while. Please wait. {handledDiscContent} titles found.
// 			</Text>
// 		</Box>
// 	);
// };

export const RipMovie = () => {
	// 1. Manage your async data, loading state, and errors in state hooks
	const [handledDiscContent, setHandledDiscContent] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// 2. Isolate the async operation inside useEffect so it runs exactly once
	useEffect(() => {
		const runDiscExtraction = async () => {
			try {
				setIsLoading(true);
				
				// Await the async data here safely
				const discContent = await openDisc(0);

				if (typeof discContent === 'string') {
					const handled = discContentHandler(discContent);
					setHandledDiscContent(handled);
				}
			} catch (error) {
				console.error('Error opening disc:', error);
				setErrorMsg('Failed to read media disc container.');
			} finally {
				setIsLoading(false);
			}
		};

		runDiscExtraction();
	}, []); // Empty dependency array ensures this only executes on mount

	// 3. Render a loading state while waiting for the Promise to resolve
	if (isLoading) {
		return (
			<Box flexDirection="column" padding={1}>
				<Text color="yellow">🔍 Scanning disc drives, please wait...</Text>
			</Box>
		);
	}

	// 4. Render an error screen if the extraction failed
	if (errorMsg) {
		return (
			<Box flexDirection="column" padding={1}>
				<Text color="red">❌ {errorMsg}</Text>
			</Box>
		);
	}

	// 5. Render your final output layout screen
	return (
		<Box flexDirection="column" padding={1}>
			<Text color="green">Ripping in progress...</Text>
			<Text color="yellow">
				This may take a while. Please wait. {handledDiscContent.length} titles found.
			</Text>
		</Box>
	);
};

export default function App() {
	const [activeTab, setActiveTab] = useState('');
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
	const [rippingMovie, setRippingMovie] = useState(false);
	const [editingMovieYear, setEditingMovieYear] = useState(false);
	const [highlightedTab, setHighlightedTab] = useState('shows');

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

	const handleHighlight = (item: Item) => {
		setHighlightedTab(item.value);
	};

	const handleNavSelect = (item: Item) => {
		if (item.value === 'settings') {
			setIsEditing(true);
			setActiveTab(item.value);
		} else if (item.value === 'shows') {
			setIsEditing(true);
			setActiveTab(item.value);
		} else if (item.value === 'movies') {
			setIsEditing(true);
			setActiveTab(item.value);
		}
	};

	const handleShowsSelect = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setActiveTab(''); // Default back to shows tab
			// navItems = [
			// 	{label: '📺 Shows', value: 'shows'},
			// 	{label: '🎬 Movies', value: 'movies'},
			// 	{label: '🔧  Settings', value: 'settings'},
			// ]; // Restore original nav items
		}
	};

	const handleMoviesSelect = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setEditingOutputPath(false);
			setEditingVideoFormat(false);
			setEditingShowFinalFolder(false);
			setEditingMovieFinalFolder(false);
			setEditingDiscDrive(false);
			setEditingHandBrakePath(false);
			setEditingMakeMKVPath(false);
			setEditingMovieTitle(false);
			setRippingMovie(false);
			setActiveTab('movies'); // Default back to movies tab
			// navItems = [
			// 	{label: '📺 Shows', value: 'shows'},
			// 	{label: '🎬 Movies', value: 'movies'},
			// 	{label: '🔧  Settings', value: 'settings'},
			// ]; // Restore original nav items
		}
		if (item.value === 'ripIT!') {
			setRippingMovie(true);
		}
		if (item.label.includes('Movie Title')) {
			setEditingMovieTitle(true);
		}
		if (item.label.includes('Movie Final Folder')) {
			setEditingMovieFinalFolder(true);
		}
		if (item.label.includes('Movie Year')) {
			setEditingMovieYear(true);
		}
	};

	const handleSettingsSelect = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setEditingOutputPath(false);
			setEditingVideoFormat(false);
			setEditingShowFinalFolder(false);
			setEditingMovieFinalFolder(false);
			setEditingDiscDrive(false);
			setEditingHandBrakePath(false);
			setEditingMakeMKVPath(false);
			setEditingMovieTitle(false);
			setRippingMovie(false);
			setActiveTab('shows'); // Default back to settings tab
			// navItems = [
			// 	{label: '📺 Shows', value: 'shows'},
			// 	{label: '🎬 Movies', value: 'movies'},
			// 	{label: '🔧  Settings', value: 'settings'},
			// ]; // Restore original nav items
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
		if (item.label.includes('Movie Title')) {
			setEditingMovieTitle(true);
		}
		if (item.label.includes('Movie Year')) {
			setEditingMovieYear(true);
		}
	};

	const handleShowsSubmit = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setActiveTab('shows'); // Default back to shows tab
			// navItems = [
			// 	{label: '📺 Shows', value: 'shows'},
			// 	{label: '🎬 Movies', value: 'movies'},
			// 	{label: '🔧  Settings', value: 'settings'},
			// ]; // Restore original nav items
		}
	};

	const handleMoviesSubmit = (item: Item) => {
		if (item.value === 'ripIT!') {
			console.log('Starting ripping process...');

			setRippingMovie(true);
			ripDisc(
				movieTitle,
				movieYear,
				discDrive,
				makemkvPath,
				handbrakePath,
				outputPath,
				videoFormat,
				movieFinalLocation,
			)
				.then(() => {
					// Handle completion
				})
				.catch(error => {
					// Handle error
					console.error('Error during ripping process:', error);
					return (
						<Box>
							<Text color="red">
								Error during ripping process: {error.message}
							</Text>
						</Box>
					);
				});
		}
		if (item.label.includes('Movie Title')) {
			setMovieTitle(movieTitle); // Update state
			setEditingMovieTitle(false);
		}
		if (item.label.includes('Movie Final Folder')) {
			setmovieFinalLocation(movieFinalLocation); // Update state
			process.env[MOVIES_FINAL_PATH] = movieFinalLocation; // Update process.env for current session
			saveToEnvFile(MOVIES_FINAL_PATH, movieFinalLocation); // Update .env.local
			setEditingMovieFinalFolder(false);
		}
		if (item.label.includes('Movie Year')) {
			setMovieYear(movieYear); // Update state
			setEditingMovieYear(false);
		}
	};

	const handleSubmit = (item: Item) => {
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
		if (item.label.includes('Movie Title')) {
			setMovieTitle(movieTitle); // Update state
			setEditingMovieTitle(false);
		}
		if (item.label.includes('Movie Year')) {
			if (
				movieYear.trim() === '' ||
				isNaN(Number(movieYear)) ||
				Number(movieYear) < 1888 ||
				Number(movieYear) > new Date().getFullYear() + 1
			) {
				console.error(
					'Invalid year. Please enter a valid year between 1888 and next year.',
				);
				return;
			}
			setMovieYear(movieYear); // Update state
			setEditingMovieTitle(false);
		}
		if (item.label.includes('Open Disc')) {
			openDisc(parseInt(discDrive))
				.then(() => {
					// Handle completion
				})
				.catch(error => {
					// Handle error
					console.error('Error opening disc:', error);
				});
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
						onHighlight={handleHighlight}
						onSelect={handleNavSelect}
					/>
				</Box>
				<Box marginTop={1}>
					<Text color="gray">
						Use arrow keys to navigate. Press Enter to select.
					</Text>
				</Box>
			</Box>

			{/* MAIN CONTENT */}
			<Box
				flexGrow={1}
				borderStyle="single"
				paddingX={2}
				flexDirection="column"
			>
				<Box flexDirection="column" width="100%">
					{activeTab === '' && (
						<Box flexDirection="column" width="100%">
							<View title="WELCOME TO DVD RIPPER CLI" color="atlas" desc="" />
							<Text color="gray">
								Select a tab from the left to get started.
							</Text>
						</Box>
					)}
					{isEditing && activeTab === 'shows' && (
						<Box marginTop={1} flexDirection="column">
							<Box flexDirection="column" width="100%">
								<View
									title="SHOWS"
									color="rainbow"
									desc="Ready to rip show..."
								/>
							</Box>
							<Box marginBottom={1}>
								<SelectInput
									isFocused={activeTab === 'shows'}
									items={[
										{
											label: 'Rip Show',
											value: 'ripShow',
										},
										{label: '🔙 Back', value: 'back'},
										// Add more show-related options here
									]}
									onSelect={handleShowsSelect}
								/>
							</Box>
							<Text color="yellow">
								⚠️ Show ripping is experimental. Use with caution.
							</Text>
						</Box>
					)}

					{/* MOVIES TAB */}
					{isEditing && activeTab === 'movies' && (
						<Box flexDirection="column" width="100%">
							<Box marginBottom={1}>
								<View
									title="MOVIES"
									color="retro"
									desc="Ready to rip movie..."
								/>
								<Text color="yellow">
									⚠️ Movie ripping is experimental. Use with caution.
								</Text>
							</Box>
							{editingMovieTitle ? (
								<Box>
									<Text>Movie Title: </Text>
									<TextInput
										value={movieTitle}
										onChange={setMovieTitle}
										onSubmit={() =>
											handleMoviesSubmit({
												label: `Movie Title: ${movieTitle}`,
												value: movieTitle,
											})
										}
									/>
								</Box>
							) : editingMovieYear ? (
								<Box>
									<Text>Movie Year: </Text>
									<TextInput
										value={movieYear}
										onChange={setMovieYear}
										onSubmit={() =>
											handleMoviesSubmit({
												label: `Movie Year: ${movieYear}`,
												value: movieYear,
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
											handleMoviesSubmit({
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
											handleMoviesSubmit({
												label: `Movie Final Folder: ${movieFinalLocation}`,
												value: movieFinalLocation,
											})
										}
									/>
								</Box>
							) : rippingMovie ? (
								<Box>
									<Text color="green">Opening Disc in progress...</Text>
									<RipMovie />
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
										{label: `Movie Year: ${movieYear}`, value: movieYear},
										{label: 'Open Disc', value: 'openDisc'},
										{
											label: 'RIP!',
											value: 'ripIT!',
										},
										{label: '🔙 Back', value: 'back'},
									]}
									onSelect={handleMoviesSelect}
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
											handleSubmit({
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
											handleSubmit({
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
											handleSubmit({
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
											handleSubmit({
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
											handleSubmit({
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
											handleSubmit({
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
											handleSubmit({
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
