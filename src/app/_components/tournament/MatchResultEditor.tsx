import { MatchResult } from "@prisma/client";
import { useState } from "react";

type MatchResultEditorProps = {
  matchId: string;
  currentResult: MatchResult;
  onResultUpdated: () => void; // callback после обновления результата
  canEdit?: boolean;
};

export function MatchResultEditor({ matchId, currentResult, onResultUpdated, canEdit }: MatchResultEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedResult, setSelectedResult] = useState(currentResult);
  const [isSaving, setIsSaving] = useState(false);

  const formatResult = (result: MatchResult) => {
    switch(result) {
      case "WHITE_WIN": return "1-0";
      case "BLACK_WIN": return "0-1";
      case "DRAW": return "½-½";
      case "NONE": return "-";
      default: return "-";
    }
  };

  const saveResult = async () => {
    setIsSaving(true);
    const res = await fetch(`/api/matches/${matchId}/result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: selectedResult }),
    });
    if (res.ok) {
      onResultUpdated(); // обновить родительские данные (фетч)
      setIsEditing(false);
    } else {
      alert("Ошибка при обновлении результата");
    }
    setIsSaving(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span>{formatResult(currentResult)}</span>
        {canEdit && (
          <button onClick={() => setIsEditing(true)} className="btn btn-ghost text-base px-1 py-1" title="Редактировать">
            ✏
          </button>
        )}
      </div>
    );
  }


  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedResult}
        onChange={(e) => setSelectedResult(e.target.value as MatchResult)}
        disabled={isSaving}
        className="select select-bordered"
      >
        <option value="NONE">-</option>
        <option value="WHITE_WIN">1-0</option>
        <option value="BLACK_WIN">0-1</option>
        <option value="DRAW">½-½</option>
      </select>

      <button
        onClick={saveResult}
        disabled={isSaving}
        className="btn btn-ghost text-base px-1 py-1"
        title="Сохранить"
      >
        {isSaving ? "⌛" : "💾"}
      </button>

      <button
        onClick={() => setIsEditing(false)}
        disabled={isSaving}
        className="btn btn-ghost text-base px-1 py-1"
        title="Отмена"
      >
        ❌
      </button>
    </div>
  );
}
