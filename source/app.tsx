import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';
import SelectInput from 'ink-select-input';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import TextInput from 'ink-text-input';
// 1. Simple Type Definition
interface Item {
	label: string;
	value: string;
}

export default function App() {
	const [activeTab, setActiveTab] = useState('shows');
	const [isEditing, setIsEditing] = useState(false);
	const [outputPath, setOutputPath] = useState('/videos/rips');
	const [editingPath, setEditingPath] = useState(false);
  const [videoFormat, setVideoFormat] = useState('MKV');
  const [showFinalLocation, setshowFinalLocation] = useState('//TRUENAS/media/shows');
  const [movieFinalLocation, setmovieFinalLocation] = useState('//TRUENAS/media/movies');
  

	let navItems: Item[] = [
		{label: '📺 Shows', value: 'shows'},
		{label: '🎬 Movies', value: 'movies'},
		{label: '⚙️ Settings', value: 'settings'},
	];

  const handleSelect = (item: Item) => {
    if (item.value === 'settings') {
      setIsEditing(true);
      setActiveTab(item.value);
    } else {
      setActiveTab(item.value);
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
	if (item.label === 'Output Folder') {
	  setEditingPath(true);
	}
  };
	return (
		<Box flexDirection="row" padding={1}>
			{/* SIDEBAR */}
			<Box borderStyle="single" width={30} flexDirection="column" paddingX={1}>
				<Text color="cyan" bold> DVD RIPPER </Text>
				<Box marginTop={1}>
					<SelectInput 
          isFocused={!isEditing}
						items={navItems} 
						onSelect={handleSelect} 
					/>
				</Box>
			</Box>

			{/* MAIN CONTENT */}
			<Box flexGrow={1} borderStyle="single" paddingX={2} flexDirection="column">
				{activeTab === 'shows' && <View title="SHOWS" color="retro" desc="Scan titles for TV Series..." />}
				{activeTab === 'movies' && <View title="MOVIES" color="rainbow" desc="Ready to rip feature film..." />}
			{activeTab === 'settings' && (
				<Box flexDirection="column">
					<Text> SETTINGS </Text>
					{editingPath ? (
						<Box>
							<Text>Output Folder: </Text>
							<TextInput value={outputPath} onChange={setOutputPath} onSubmit={() => setEditingPath(false)} />
						</Box>
					) : (
						<SelectInput
							items={[
								{label: `Output Folder: ${outputPath}`, value: '/videos/rips'},
								{label: `Video Format: ${videoFormat}`, value: 'format'},
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
type ValidGradientName = 'retro' | 'rainbow' | 'atlas' | 'cristal' | 'teen' | 'mind';

function View({title, color, desc}: {title: string; color: ValidGradientName; desc: string}) {
  return (
    <Box flexDirection="column">
      <Gradient name={color}>
        <BigText text={title} font="tiny" />
      </Gradient>
      <Text italic color="gray">{desc}</Text>
    </Box>
  );
}
