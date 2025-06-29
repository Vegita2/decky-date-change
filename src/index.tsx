import { ButtonItem, PanelSection, PanelSectionRow, SliderField, staticClasses, TextField } from '@decky/ui';
import { callable, definePlugin } from '@decky/api';
import { useEffect, useState } from 'react';
import { FaNetworkWired } from 'react-icons/fa';

const get_system_datetime = callable<[], [number, number, number, number, number]>('get_system_datetime');
const set_system_datetime = callable<[number, number, number, number, number, number], void>('set_system_datetime');
const auto_datetime = callable<[], void>('auto_datetime');

function Content() {
	const [year, setYear] = useState<string>('2003');
	const [month, setMonth] = useState<number>(1);
	const [day, setDay] = useState<number>(1);
	const [hour, setHour] = useState<number>(1);
	const [minute, setMinute] = useState<number>(1);
	
	const onSubmit = async () => {
		await set_system_datetime(parseInt(year), month, day, hour, minute, 0);
	};
	
	const onDrop = async () => {
		const now = new Date();
		await set_system_datetime(
			now.getFullYear(),
			now.getMonth() + 1,
			now.getDate(),
			now.getHours(),
			now.getMinutes(),
			now.getSeconds(),
		);
		await auto_datetime();
	};
	
	useEffect(() => {
		get_system_datetime().then(([year, month, day, hour, minute]) => {
			setYear(year.toString());
			setMonth(month);
			setDay(day);
			setHour(hour);
			setMinute(minute);
		});
	}, []);
	
	return (
		<PanelSection>
			<PanelSectionRow>
				<TextField
					label="Year"
					value={year}
					onChange={e => setYear(e.target.value)}
				/>
				<SliderField
					label="Month"
					showValue={true}
					min={1}
					max={12}
					value={month}
					onChange={setMonth}
				/>
				
				<SliderField
					label="Day"
					showValue={true}
					min={1}
					max={31}
					value={day}
					onChange={setDay}
				/>
				
				<SliderField
					label="Hour"
					showValue={true}
					min={0}
					max={23}
					value={hour}
					onChange={setHour}
				/>
				
				<SliderField
					label="Minute"
					showValue={true}
					min={0}
					max={59}
					value={minute}
					onChange={setMinute}
				/>
			</PanelSectionRow>
			
			<PanelSectionRow>
				<ButtonItem
					layout="below"
					onClick={onSubmit}
				>
					Apply
				</ButtonItem>
			</PanelSectionRow>
			
			<PanelSectionRow>
				<ButtonItem
					layout="below"
					onClick={onDrop}
				>
					Restore Defaults
				</ButtonItem>
			</PanelSectionRow>
		</PanelSection>
	);
}

export default definePlugin(() => {
	return {
		name: 'Date Settings',
		titleView: <div className={staticClasses.Title}>Date change</div>,
		content: <Content/>,
		icon: <FaNetworkWired/>,
		onDismount() {
			console.log('Unloading');
		},
	};
});
