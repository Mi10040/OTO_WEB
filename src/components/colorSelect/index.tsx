import React, { FC, useEffect, useState } from 'react';
import { SketchPicker, ChromePicker } from 'react-color';
import styles from './index.less';

type colorFc = {
  value?: any;
  onChange?: Function;
};

const ColorSelect: FC<colorFc> = (props: any) => {
  const { value = 'rgba(255,255,255,1)', onChange = () => {} } = props;
  const [visible, setVisible] = useState(false);
  const [colorValue, setColorValue] = useState({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });

  useEffect(() => {
    let rgba = value
      .slice(value.indexOf('(') + 1, value.indexOf(')'))
      .split(',');
    setColorValue({
      r: rgba[0],
      g: rgba[1],
      b: rgba[2],
      a: rgba[3],
    });
  }, []);

  const thChange = (color: any) => {
    setColorValue(color.rgb);
  };

  const toChange = (color: any) => {
    onChange(
      `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`,
    );
  };
  const showSelect = () => setVisible(!visible);
  const onSelect = () => setVisible(false);

  return (
    <div>
      <div
        className={styles.btn}
        style={{
          width: '48px',
          height: '24px',
        }}
        onClick={showSelect}
      >
        <div
          style={{
            background: `rgba(${colorValue.r},${colorValue.g},${colorValue.b},${colorValue.a})`,
          }}
        />
      </div>
      {visible && (
        <div className={styles.select} style={{ top: 'calc(24px + 9px)' }}>
          <div className={styles.onShow} onClick={onSelect} />
          <ChromePicker
            color={colorValue}
            onChange={thChange}
            onChangeComplete={toChange}
          />
        </div>
      )}
    </div>
  );
};

export default ColorSelect;
