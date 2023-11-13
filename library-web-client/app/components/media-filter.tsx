import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { ImageIcon, VideoIcon, PlayIcon } from '@radix-ui/react-icons';
import { Fragment } from 'react';

export default function MediaFilter({setValue, value}: any) {
  
  const handleChange = (newValue: any) => {
    if (value.includes('all') && newValue.length > 1) {
      const filteredValue = newValue.filter((val: any) => val !== 'all');
      setValue(filteredValue);
    } else if (newValue.includes('all') || newValue.length == 0) {
      setValue(['all']);
    } else {
      setValue(newValue);
    }
  }

  return (
    <Fragment>
      <ToggleGroup.Root
        className="FilterGroup"
        type="multiple"
        value={value}
        onValueChange={handleChange}
        aria-label="Text alignment"
      >
        <ToggleGroup.Item className="FilterGroupItem" value="all" aria-label="Left aligned">
          <p>All</p>
        </ToggleGroup.Item>
        <ToggleGroup.Item className="FilterGroupItem" value="image" aria-label="Center aligned">
          <ImageIcon />
        </ToggleGroup.Item>
        <ToggleGroup.Item className="FilterGroupItem" value="audio" aria-label="Right aligned">
          <PlayIcon />
        </ToggleGroup.Item>
        <ToggleGroup.Item className="FilterGroupItem" value="video" aria-label="Right aligned">
          <VideoIcon />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </Fragment>
  );
}