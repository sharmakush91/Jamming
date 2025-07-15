import TrackList from "../TrackList/TrackList";
import "./Playlist.css";

export default function Playlist({
  playlist,
  playlistTracks,
  onRemove,
  onNameChange,
  onSave,
}) {
  function handleNameChange(e) {
    onNameChange(e.target.value);
  }
  return (
    <div className="Playlist">
      <input value={playlist} onChange={handleNameChange} />
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button className="Playlist-save" onClick={onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}
