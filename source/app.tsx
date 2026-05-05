import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import SelectInput from 'ink-select-input';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import TextInput from 'ink-text-input';
import * as dotenv from 'dotenv';


const OUTPUT_FOLDER = 'OUTPUT_FOLDER';
const VIDEO_FORMAT = 'VIDEO_FORMAT';
const SHOWS_FINAL_PATH = 'SHOWS_FINAL_PATH';
const MOVIES_FINAL_PATH = 'MOVIES_FINAL_PATH';

dotenv.config();

// 1. Simple Type Definition
interface Item {
	label: string;
	value: string;
}

export default function App() {
	const [activeTab, setActiveTab] = useState('shows');
	const [isEditing, setIsEditing] = useState(false);
	const [outputPath, setOutputPath] = useState(process.env[OUTPUT_FOLDER]);
	const [editingOutputPath, setEditingOutputPath] = useState(false);
	const [editingVideoFormat, setEditingVideoFormat] = useState(false);
	const [videoFormat, setVideoFormat] = useState(process.env[VIDEO_FORMAT]);
  const [editingShowFinalFolder, setEditingShowFinalFolder] = useState(false);
  const [editingMovieFinalFolder, setEditingMovieFinalFolder] = useState(false);
	const [showFinalLocation, setshowFinalLocation] = useState(
		process.env[SHOWS_FINAL_PATH],
	);
	const [movieFinalLocation, setmovieFinalLocation] = useState(
		process.env[MOVIES_FINAL_PATH],
	);

	let navItems: Item[] = [
		{label: '📺 Shows', value: 'shows'},
		{label: '🎬 Movies', value: 'movies'},
		{label: '⚙️ Settings', value: 'settings'},
	];

	const handleSelect = (item: Item) => {
		if (item.value === 'settings') {
			setIsEditing(true);
			setActiveTab(item.value);
    }
      else {setActiveTab(item.value);
		}
	};

	const handleSettingsSelect = (item: Item) => {
		if (item.value === 'back') {
			setIsEditing(false);
			setActiveTab('shows'); // Default back to shows tab
			navItems = [
				{label: '📺 Shows', value: 'shows'},
				{label: '🎬 Movies', value: 'movies'},
				{label: '⚙️ Settings', value: 'settings'},
			]; // Restore original nav items
		}
		if (item.label.includes('Output Folder')) {
			setEditingOutputPath(true);
		}
		if (item.label.includes('Video Format')) {
			setEditingVideoFormat(true);
		}
    if(item.label.includes('Show Final Folder')) {
      setEditingShowFinalFolder(true);    
    }
    if(item.label.includes('Movie Final Folder')) {
      setEditingMovieFinalFolder(true);    
    }
	};
	return (
		<Box flexDirection="row" padding={1}>
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
				{activeTab === 'shows' && (
					<View
						title="SHOWS"
						color="retro"
						desc="Scan titles for TV Series..."
					/>
				)}
				{activeTab === 'movies' && (
					<View
						title="MOVIES"
						color="rainbow"
						desc="Ready to rip feature film..."
					/>
				)}
				{activeTab === 'settings' && (
					<Box flexDirection="column">
						<Text> SETTINGS </Text>
						{editingOutputPath ? (
							<Box>
								<Text>Output Folder: </Text>
								<TextInput
									value={outputPath}
									onChange={setOutputPath}
									onSubmit={() => setEditingOutputPath(false)}
								/>
							</Box>
						) : editingVideoFormat ? (
							<Box>
								<Text>Video Format: </Text>
								<TextInput
									value={videoFormat}
									onChange={setVideoFormat}
									onSubmit={() => setEditingVideoFormat(false)}
								/>
							</Box>
						) : editingShowFinalFolder ? (
							<Box>
								<Text>Show Final Folder: </Text>
								<TextInput
									value={showFinalLocation}
									onChange={setshowFinalLocation}
									onSubmit={() => setEditingShowFinalFolder(false)}
								/>
							</Box>
						) : editingMovieFinalFolder ? (
							<Box>
								<Text> Movie Final Folder: </Text>
								<TextInput
									value={movieFinalLocation}
									onChange={setmovieFinalLocation}
									onSubmit={() => setEditingMovieFinalFolder(false)}
								/>
							</Box>
						) : (
							<SelectInput
								isFocused={activeTab === 'settings'}
								items={[
									{
										label: `Output Folder: ${outputPath}`,
										value: '/videos/rips',
									},
									{label: `Video Format: ${videoFormat}`, value: 'format'},
                  {
										label: `Show Final Folder: ${showFinalLocation}`,
										value: '/videos/rips',
									},
                  {
										label: `Movie Final Folder: ${movieFinalLocation}`,
										value: '/videos/rips',
									},
									{label: '🔙 Back', value: 'back'},
								]}
								onSelect={handleSettingsSelect}
							/>
						)}
					</Box>
				)}
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
		<Box flexDirection="column">
			<Gradient name={color}>
				<BigText text={title} font="tiny" />
			</Gradient>
			<Text italic color="gray">
				{desc}
			</Text>
		</Box>
	);
}
