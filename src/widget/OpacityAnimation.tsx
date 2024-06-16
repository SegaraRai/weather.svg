export function OpacityAnimation({
  index,
  total,
  partDuration,
  switchDuration,
}: {
  readonly index: number;
  readonly total: number;
  readonly partDuration: number;
  readonly switchDuration: number;
}) {
  if (total <= 1) {
    return <></>;
  }

  const totalDuration = total * partDuration;
  const showSwitchStart = index * partDuration;
  const showSwitchFinish = showSwitchStart + switchDuration;
  const hideSwitchStart = showSwitchStart + partDuration - switchDuration;
  const hideSwitchFinish = showSwitchStart + partDuration;
  const keyTimes = [
    0,
    showSwitchStart / totalDuration,
    showSwitchFinish / totalDuration,
    hideSwitchStart / totalDuration,
    hideSwitchFinish / totalDuration,
    1,
  ];
  const values = [0, 0, 1, 1, 0, 0];
  if (index === 0) {
    values.shift();
    keyTimes.shift();
  } else if (index === total - 1) {
    values.pop();
    keyTimes.pop();
  }

  return (
    <animate
      attributeName="opacity"
      values={values.join(";")}
      keyTimes={keyTimes.join(";")}
      dur={`${totalDuration}s`}
      repeatCount="indefinite"
    />
  );
}
