import test from 'node:test';
import assert from 'node:assert/strict';

import { getMemberPortalPreview, getMemberStateGallery } from '../src/mocks/memberStateGallery.ts';

test('portal preview follows the real member home structure for each member type', () => {
  const vjPreview = getMemberPortalPreview('vj_member');
  const generalPreview = getMemberPortalPreview('general_member');

  assert.deepEqual(vjPreview.sections, ['profile', 'bonus', 'quick_actions', 'level_progress', 'top_vj', 'transactions', 'notifications', 'voice_room']);
  assert.equal(vjPreview.quickActions.includes('live'), true);
  assert.equal(vjPreview.quickActions.includes('training'), true);
  assert.equal(generalPreview.quickActions.includes('live'), false);
  assert.equal(generalPreview.quickActions.includes('training'), false);
  assert.equal(generalPreview.sections.includes('level_progress'), false);
  assert.equal(generalPreview.sections.includes('voice_room'), true);
});

test('VJ mock gallery covers every member workflow state', () => {
  const gallery = getMemberStateGallery('vj_member');

  assert.deepEqual(gallery.kycStates.map((state) => state.id), ['not_submitted', 'pending', 'approved', 'rejected']);
  assert.deepEqual(gallery.appStates.map((state) => state.id), ['active', 'training', 'web_pending', 'disabled']);
  assert.deepEqual(gallery.trainingStates.map((state) => state.id), ['locked', 'in_progress', 'ready', 'passed', 'retryable', 'exhausted']);
  assert.deepEqual(gallery.levelStates.map((state) => state.id), ['level_1', 'level_2', 'level_3', 'level_4']);
  assert.equal(gallery.transactionRows.length >= 4, true);
  assert.equal(gallery.notificationStates.length >= 5, true);
  assert.equal(gallery.voiceStates.length >= 3, true);
});

test('General mock gallery keeps shared wallet states and removes VJ-only states', () => {
  const gallery = getMemberStateGallery('general_member');

  assert.deepEqual(gallery.appStates.map((state) => state.id), ['no_affiliation']);
  assert.equal(gallery.trainingStates.length, 0);
  assert.equal(gallery.levelStates.length, 0);
  assert.equal(gallery.sharedStates.includes('voice_room'), true);
  assert.equal(gallery.sharedStates.includes('wallet'), true);
  assert.equal(gallery.transactionRows.every((row) => row.appName === 'ทั่วไป'), true);
});
