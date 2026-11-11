import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,remaining,valid,near,step,sell,upgrade,finish,read,persist,KEY} from '../game/core.mjs';

const store = () => {
  const data = new Map();
  let fail = false;
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => { if (fail) throw Error('QuotaExceededError'); data.set(key, value); },
    setFailure: value => { fail = value; },
    raw: () => data.get(KEY)
  };
};

function endState(dust, bag = 0) {
  const s = initial();
  for (const tile of s.tiles) { tile.n = 0; tile.p = 0; }
  s.tiles[0].n = dust;
  s.bag = bag;
  s.sold = 900 - dust - bag;
  s.wallet = s.sold;
  return s;
}

test('P0-A: finish threshold 0..5 and one-time reward', () => {
  for (let dust = 0; dust <= 5; dust++) {
    const s = endState(dust);
    assert.ok(valid(s));
    assert.equal(finish(s), dust <= 4, 'remaining=' + dust);
    if (dust <= 4) {
      assert.equal(s.complete, true);
      assert.equal(s.sold, 900);
      assert.equal(s.wallet, 1000);
      assert.equal(finish(s), false);
      assert.equal(sell(s), false);
      assert.equal(s.wallet, 1000);
      assert.ok(valid(s));
    }
  }
});

test('P0-A: full bag, no double sale, completion on final depot sale', () => {
  const s = endState(0, 90);
  assert.ok(valid(s));
  assert.ok(sell(s));
  assert.equal(s.wallet, 1000);
  assert.equal(s.complete, true);
  assert.equal(sell(s), false);
  assert.equal(finish(s), false);
  assert.ok(valid(s));
});

test('P0-A: save failure preserves last committed snapshot and retries exact reward', () => {
  const db = store();
  const before = endState(0, 90);
  const savedBefore = persist(db, before, null);
  const snapshot = db.raw();
  const candidate = structuredClone(savedBefore);
  assert.ok(sell(candidate));
  db.setFailure(true);
  assert.throws(() => persist(db, candidate, savedBefore), /QuotaExceededError/);
  assert.equal(db.raw(), snapshot);
  assert.equal(read(db).current.complete, false);
  db.setFailure(false);
  const savedAfter = persist(db, candidate, savedBefore);
  assert.equal(savedAfter.wallet, 1000);
  assert.equal(savedAfter.seq, savedBefore.seq + 1);
  assert.equal(read(db).previous.seq, savedBefore.seq);
  assert.equal(read(db).current.complete, true);
  assert.equal(sell(read(db).current), false);
});

test('P0-A: corrupt current snapshot never auto-promotes invalid backup', () => {
  const db = store();
  const s = initial();
  db.setItem(KEY, JSON.stringify({current: {version: 1}, previous: s}));
  const recovered = read(db);
  assert.equal(recovered.corrupt, true);
  assert.ok(valid(recovered.previous));
  assert.equal(db.raw(), JSON.stringify({current: {version: 1}, previous: s}));
  s.wallet = 123;
  db.setItem(KEY, JSON.stringify({current: {}, previous: s}));
  assert.equal(read(db).previous, null);
});

test('P0-A: v1 save envelope and initial state remain readable', () => {
  const db = store();
  assert.equal(read(db).fresh, true);
  const before = initial();
  const after = persist(db, before, null);
  assert.equal(after.version, 1);
  assert.equal(read(db).current.version, 1);
  assert.equal(read(db).current.seq, 1);
  assert.ok(valid(read(db).current));
});

