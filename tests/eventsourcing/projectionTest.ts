import { Projection } from 'src/infrastructure/projections/projection';
import { Event } from '../../src/eventsourcing/event';

export type ProjectionTest<E extends Event, View> = (
  ...events: E[]
) => ProjectionTestRunner<View>;

export const Given =
  <P extends Projection<E>, E extends Event, View>(projection: P) =>
  (...events: E[]) => {
    for (const event of events) {
      projection.handle(event);
    }
    return new ProjectionTestRunner<View>();
  };

class ProjectionTestRunner<View> {
  then(expected: View, actual: View): ProjectionTestRunner<View>;
  then(expected: View[], actual: View[]): ProjectionTestRunner<View>;
  then(
    expected: View | View[],
    actual: View | View[]
  ): ProjectionTestRunner<View> {
    if (Array.isArray(expected)) {
      expect(Array.isArray(actual)).toBeTruthy();
    }

    expect(actual).toStrictEqual(expected);

    return this;
  }
}
