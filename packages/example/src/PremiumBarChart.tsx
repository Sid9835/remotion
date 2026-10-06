import {loadFont} from '@remotion/google-fonts/Inter';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

const {fontFamily} = loadFont('normal', {
	weights: ['400', '500', '600'],
	subsets: ['latin'],
});

const COLORS = {
	background: '#FAFBFC',
	bar: '#1E3A8A',
	value: '#0F1E4D',
	label: '#8A94A6',
	baseline: '#D9DEE5',
};

const DATA = [
	{label: 'A', value: 35},
	{label: 'B', value: 52},
	{label: 'C', value: 68},
	{label: 'D', value: 84},
	{label: 'E', value: 96},
];

const MAX_VALUE = 100;
const CHART_HEIGHT = 560;
const BAR_WIDTH = 120;
const BAR_GAP = 96;
const CHART_WIDTH = DATA.length * BAR_WIDTH + (DATA.length - 1) * BAR_GAP;

// Timing (frames @ 30fps)
const BACKGROUND_FADE_END = 15;
const CHART_FADE_START = 8;
const CHART_FADE_END = 30;
const BARS_START = 22;
const BAR_STAGGER = 8;
const BAR_DURATION = 48;
const LABEL_DELAY = 26;
const LABEL_DURATION = 18;
const HOLD_DURATION = 60;

export const PREMIUM_BAR_CHART_DURATION =
	BARS_START +
	(DATA.length - 1) * BAR_STAGGER +
	Math.max(BAR_DURATION, LABEL_DELAY + LABEL_DURATION) +
	HOLD_DURATION;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const PremiumBarChart: React.FC = () => {
	const frame = useCurrentFrame();

	const backgroundOpacity = interpolate(
		frame,
		[0, BACKGROUND_FADE_END],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.out(Easing.quad),
		},
	);

	const chartOpacity = interpolate(
		frame,
		[CHART_FADE_START, CHART_FADE_END],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.out(Easing.quad),
		},
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
			<AbsoluteFill
				style={{
					backgroundColor: COLORS.background,
					opacity: backgroundOpacity,
					justifyContent: 'center',
					alignItems: 'center',
					fontFamily,
				}}
			>
				<div
					style={{
						position: 'relative',
						width: CHART_WIDTH,
						height: CHART_HEIGHT,
						opacity: chartOpacity,
					}}
				>
					{DATA.map((item, index) => {
						const start = BARS_START + index * BAR_STAGGER;
						const progress = interpolate(
							frame,
							[start, start + BAR_DURATION],
							[0, 1],
							{
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
								easing: easeOut,
							},
						);
						const barHeight =
							(item.value / MAX_VALUE) * CHART_HEIGHT * progress;
						const valueOpacity = interpolate(
							frame,
							[start, start + 10],
							[0, 1],
							{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
						);
						const labelOpacity = interpolate(
							frame,
							[start + LABEL_DELAY, start + LABEL_DELAY + LABEL_DURATION],
							[0, 1],
							{
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
								easing: Easing.out(Easing.quad),
							},
						);
						const left = index * (BAR_WIDTH + BAR_GAP);

						return (
							<div key={item.label}>
								<div
									style={{
										position: 'absolute',
										left,
										bottom: 0,
										width: BAR_WIDTH,
										height: barHeight,
										backgroundColor: COLORS.bar,
										borderRadius: '8px 8px 2px 2px',
									}}
								/>
								<div
									style={{
										position: 'absolute',
										left,
										bottom: barHeight + 20,
										width: BAR_WIDTH,
										textAlign: 'center',
										fontSize: 40,
										fontWeight: 600,
										letterSpacing: '-0.02em',
										color: COLORS.value,
										fontVariantNumeric: 'tabular-nums',
										opacity: valueOpacity,
									}}
								>
									{Math.round(item.value * progress)}
								</div>
								<div
									style={{
										position: 'absolute',
										left,
										top: CHART_HEIGHT + 28,
										width: BAR_WIDTH,
										textAlign: 'center',
										fontSize: 24,
										fontWeight: 500,
										letterSpacing: '0.08em',
										color: COLORS.label,
										opacity: labelOpacity,
									}}
								>
									{item.label}
								</div>
							</div>
						);
					})}
					<div
						style={{
							position: 'absolute',
							left: -40,
							right: -40,
							bottom: -1,
							height: 1,
							backgroundColor: COLORS.baseline,
						}}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
