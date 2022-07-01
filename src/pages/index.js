import React from 'react';
// import styles from './index.less';
import { cx } from '@emotion/css';
import { Hello } from './components/index';
import { Button } from 'antd';

export default function IndexPage() {
  return (
    <div>
      <h1 className={cx('bg-red-300')}>
        Page index
        <Hello></Hello>
        <Button type="primary">button2</Button>
        <div>that's amazing</div>
      </h1>
    </div>
  );
}
