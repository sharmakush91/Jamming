import Track from "../Track/Track";
import "./TrackList.css";

export default function TrackList({ tracks, onAdd, isRemoval, onRemove }) {
  return (
    <div className="TrackList">
      {tracks.map((track, i) => (
        <Track
          key={track.id}
          track={track}
          onAdd={onAdd}
          isRemoval={isRemoval}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
