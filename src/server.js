import Server from 'socket.io';

export default function startServer(store) {
  const io = new Server().attach(8090);

  // We are now publishing the whole state to everyone whenever any changes occur. This may end up causing a lot of data transfer. One could think of various ways of optimizing this (e.g. just sending the relevant subset, sending diffs instead of snapshots...), but this implementation has the benefit of being easy to write, so we'll just use it for our example app.)
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );

  // Gets the current state as soon as the client connects
  io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });

  // There are some obvious security considerations here. We're allowing any connected Socket.io client to dispatch any action into the Redux store.
  // In most real-world cases, there should be some kind of firewall here, probably not dissimilar to the one in the Vert.x Event Bus Bridge. Apps that have an authentication mechanism should also plug it in here.
}
