import api from '../services/api';
import types from '../constants/actionTypes';
import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects'
import { fetchBoards, fetchBoard, createBoard, removeBoard, updateBoard } from '../actions/boardsActions';
import { startProgressBar, stopProgressBar } from '../actions/progressBarActions';

function* fetchBoardsTask() {
  try {
    yield put(startProgressBar());
    const payload = yield call(api.fetchBoards);
    yield put(fetchBoards.success(payload));
  } catch(err) {
    yield put(fetchBoards.failure(err.message));
  } finally {
    yield put(stopProgressBar());
  }
}

function* fetchBoardTask(action) {
  try {
    yield put(startProgressBar());
    const payload = yield call(api.fetchBoard, action.payload.id);
    yield put(fetchBoard.success(payload));
  } catch(err) {
    yield put(fetchBoard.failure(err.message));
  } finally {
    yield put(stopProgressBar());
  }
}

function* createBoardTask(action) {
  try {
    const payload = yield call(api.createBoard, action.payload.title);
    yield put(createBoard.success(payload));
  } catch(err) {
    yield put(createBoard.failure(err.message));
  }
}

function* removeBoardTask(action) {
  try {
    const payload = yield call(api.removeBoard, action.payload.id);
    yield put(removeBoard.success(payload));
  } catch(err) {
    yield put(removeBoard.failure(err.message)); 
  }
}

function* updateBoardTask({ payload: { id, props, params } }) {
  try {
    const payload = yield call(api.updateBoard, id, props, params);
    yield put(updateBoard.success(payload));
  } catch(err) {
    yield put(updateBoard.failure(err.message));
  }
}

function* watchFetchBoards() {
  yield* takeEvery(types.BOARDS_FETCH_REQUEST, fetchBoardsTask);
}

function* watchFetchBoard() {
  yield* takeEvery(types.BOARD_FETCH_REQUEST, fetchBoardTask);
}

function* watchCreateBoard() {
  yield* takeEvery(types.BOARD_CREATE_REQUEST, createBoardTask);
}

function* watchRemoveBoard() {
  yield* takeEvery(types.BOARD_REMOVE_REQUEST, removeBoardTask);
}

function* watchUpdateBoard() {
  yield* takeEvery(types.BOARD_UPDATE_REQUEST, updateBoardTask);
}

export default function* boardsSaga() {
  yield [
    watchFetchBoards(),
    watchFetchBoard(),
    watchCreateBoard(),
    watchRemoveBoard(),
    watchUpdateBoard(),
  ];
}