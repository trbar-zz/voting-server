import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe ('aplication logic', () => {

	describe('setEntries', () => {

		it('adds the entries to the state', () => {
			const state = Map();
			const entries = List.of('Trainspotting', '28 Days Later');
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', '28 Days Later')
			}));
		});

		it('converts to immutable', () => {
			const state = Map();
			const entries = ['Trainspotting', '28 Days Later'];
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({
				entries: List.of('Trainspotting', '28 Days Later')
			}));	
		});
	});

	describe('next', () => {

		it('takes two initial entries to vote', () => {
			const state = Map({
				entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
			});
			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later')
				}),
				entries: List.of('Sunshine')
			}));
		});

		it('puts a winner back to the list of entries', () => {

			const state = Map({
				entries: List.of('Sunshine', '127 Hours', 'Millions'),
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 3,
						'28 Days Later': 2
					})
				})
			});

			const nextState = next(state)

			expect(nextState).to.equal(Map({
				entries: List.of('Millions', 'Trainspotting'),
				vote: Map({
					pair: List.of('Sunshine' , '127 Hours')
				})
			}));
		});

		it('puts both back if there is a tie', () =>{

			const state = Map({
				entries: List.of('Sunshine', '127 Hours', 'Millions'),
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 3,
						'28 Days Later': 3
					})
				})
			});

			const nextState = next(state)

			expect(nextState).to.equal(Map({
				entries: List.of('Millions', 'Trainspotting', '28 Days Later'),
				vote: Map({
					pair: List.of('Sunshine' , '127 Hours')
				})
			}));
		});

		it('marks winner when only one is left', () => {

			const state = Map({
				entries: List.of(),
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 4,
						'28 Days Later': 2
					})
				})
			});

			const nextState = next(state);

			expect(nextState).to.equal(Map({
				winner: 'Trainspotting'
			}));
		})
	});

	describe('vote', () => {

		it('initializes the tally', () => {
			
			const state = Map({
				entries: List.of('Sunshine'),
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later')
				})
			});

			const nextState = vote(state, 'Trainspotting');

			expect(nextState).to.equal(Map({
				entries: List.of('Sunshine'),
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 1
					})
				})
			}));
		});

		it('adds to the existing tally', () => {
			
			const state = Map({
				entries: List.of('Sunshine'),
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 2,
						'28 Days Later': 3
					})
				})
			});

			const nextState = vote(state, '28 Days Later');

			expect(nextState).to.equal(Map({
				entries: List.of('Sunshine'),
				vote: Map({
					pair: List.of('Trainspotting', '28 Days Later'),
					tally: Map({
						'Trainspotting': 2,
						'28 Days Later': 4
					})
				})
			}));
		});
	});
});