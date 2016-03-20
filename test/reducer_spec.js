import {expect} from 'chai';
import {Map, fromJS} from 'immutable';

import reducer from '../src/reducer';

describe('reducer', () => {

	it('handles SET_ENTRIES', () => {

		const initialState = Map();
		const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			entries: ['Trainspotting']
		}));
	}); 

	it ('handles NEXT', () => {

		const initialState = fromJS({
			entries: ['Trainspotting', '28 Days Later']
		});
		const action = {type: 'NEXT'};
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			entries: [],
			vote: {
				pair: ['Trainspotting', '28 Days Later']
			}
		}));
	});

	it ('handles VOTE', () => {

		const initialState = fromJS({
			entries: [],
			vote: {
				pair: ['Trainspotting', '28 Days Later']
			}
		});
		const action = {type: 'VOTE', entry: 'Trainspotting'};
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			entries: [],
			vote: {
				pair: ['Trainspotting', '28 Days Later'],
			    tally: {'Trainspotting': 1}
			}
		}));
	});

	it('has no initial state', () => {

		const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
		const nextState = reducer(undefined, action);

		expect(nextState).to.equal(fromJS({
			entries: ['Trainspotting']
		}));
	});

	it('conducts a reduce test, passing in two movies and ensuring tallying works correctly', () => {

		const actions = [
		  {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
		  {type: 'NEXT'},
		  {type: 'VOTE', entry: 'Trainspotting'},
		  {type: 'VOTE', entry: '28 Days Later'},
		  {type: 'VOTE', entry: 'Trainspotting'},
		];
		const finalState = actions.reduce(reducer, Map());

		expect(finalState).to.equal(fromJS({
			entries: [],
			vote: {
				pair: ['Trainspotting', '28 Days Later'],
					tally: Map({
						'Trainspotting': 2,
						'28 Days Later': 1
					})
			    }
		}));
	});

	it('conducts a reduce test, passing in two movies, making a tally, and producing a winner', () => {

		const actions = [
		  {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
		  {type: 'NEXT'},
		  {type: 'VOTE', entry: 'Trainspotting'},
		  {type: 'VOTE', entry: '28 Days Later'},
		  {type: 'VOTE', entry: 'Trainspotting'},
		  {type: 'NEXT'},
		];
		const finalState = actions.reduce(reducer, Map());

		expect(finalState).to.equal(fromJS({
			winner: 'Trainspotting'
		}));
	});
});