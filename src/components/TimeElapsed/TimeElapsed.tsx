import React, { memo } from 'react';
import type { StatisticTimerProps } from 'antd';
import { Col, Row, Statistic } from 'antd';

const { Timer } = Statistic;

// const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Dayjs is also OK
// // const before = Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
// const before = Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
//
// const onFinish: StatisticTimerProps['onFinish'] = () => {
//   console.log('finished!');
// };

const onChange: StatisticTimerProps['onChange'] = (val) => {
  if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
    console.log('changed!');
  }
};

export const TimeElapsed = memo(() => (
  <Row gutter={16}>
    <Col span={12}>
      <Timer type="countup" value={Date.now()} onChange={onChange} />
    </Col>
  </Row>
));