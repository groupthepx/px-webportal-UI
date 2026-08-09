import test from 'node:test';
import assert from 'node:assert/strict';

import { getVisibleMenuItems } from '../src/components/Header/NavigationMenu/items.ts';

const flattenNames = (sections) => sections.flatMap((section) => section.items.flatMap((item) => [
  item.name,
  ...(item.items || []).map((child) => child.name),
]));

test('General User does not see VJ-only navigation items', () => {
  const names = flattenNames(getVisibleMenuItems(true, 'general_member'));

  assert.equal(names.includes('สังกัด'), false);
  assert.equal(names.includes('ห้องเสียง'), true);
  assert.equal(names.includes('ยืนยันขึ้น Live'), false);
  assert.equal(names.includes('ห้องเรียนออนไลน์'), false);
});

test('General User keeps shared member functions', () => {
  const names = flattenNames(getVisibleMenuItems(true, 'general_member'));

  assert.equal(names.includes('ตลาด PX'), true);
  assert.equal(names.includes('อังเปา'), true);
  assert.equal(names.includes('ของขวัญ'), true);
  assert.equal(names.includes('รับคะแนน'), true);
});

test('VJ User keeps VJ navigation items', () => {
  const names = flattenNames(getVisibleMenuItems(true, 'vj_member'));

  assert.equal(names.includes('สังกัด'), true);
  assert.equal(names.includes('ยืนยันขึ้น Live'), true);
  assert.equal(names.includes('ห้องเรียนออนไลน์'), true);
});
