import {Box, useInput, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {PropsWithChildren, useState} from 'react';

export default function App() {
	return (
		<Box width="50%">
			<MainLayout>
				<SideBar />
				<Content />
			</MainLayout>
			{/* {getMovieOrShow()}
			{getMovieName()} */}
		</Box>
	);
}

export const getMovieOrShow = () => {
	const [type, setType] = useState<string>('');
	const typeSelect = (item: {value: string}) => {
		setType(item.value);
		console.log(`You selected ${item.value}`);
		return item.value;
	};
	const options = [
		{label: 'Movie', value: 'movie'},
		{label: 'Show', value: 'show'},
	];
	return <SelectInput items={options} onSelect={typeSelect} />;
};


function MainLayout({children}: PropsWithChildren) {
	return <Box>{children}</Box>;
}

function SideBar() {
	return (
		<Box height={"100%"} borderStyle={'single'} width={40}>
			<Text>I'm a sidebar</Text>
		</Box>
	);
}

function Content() {
	return (
		<Box height={"100%"} width={'100%'} borderStyle={'single'}>
			<Text>Im' the content area</Text>
		</Box>
	);
}
