import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note, NotesStoreState, StyleMode } from "../types/note";
import { extractTags, getNoteTitle } from "../lib/note-utils";

// Clear localStorage once to ensure first-time seeding of DEFAULT_NOTES
if (typeof window !== "undefined" && !localStorage.getItem("notes-space-seeded-v2")) {
  localStorage.removeItem("notes-app-storage");
  localStorage.setItem("notes-space-seeded-v2", "true");
}

// Helper for test-safe UUID generation (jsdom/node environment safe)
const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const DEFAULT_NOTES: Note[] = [
  {
    id: "guide-1",
    title: "🚀 Hướng Dẫn Sử Dụng NoteSpace",
    content: `# 🚀 Chào mừng bạn đến với NoteSpace!

Đây là một ứng dụng ghi chú đa phong cách thế hệ mới. NoteSpace hỗ trợ 3 phong cách làm việc khác nhau: **Minimalist**, **Youthful**, và **Knowledge Management**. Hãy đọc tài liệu này để khám phá toàn bộ tính năng!

---

## 🎨 1. Khám phá 3 Phong cách Giao diện (Góc trên bên phải)
*   **Minimalist (Tối giản):**
    *   Thích hợp để tập trung cao độ khi viết lách.
    *   *Tính năng đặc biệt:* Nhấp nút **Focus Mode** trên thanh tiêu đề để ẩn thanh sidebar trái, mở rộng 100% diện tích gõ chữ.
*   **Youthful (Trẻ trung & Vui vẻ):**
    *   Giao diện rực rỡ, font chữ tròn đáng yêu, các thẻ note chuyển động mượt mà.
    *   *Tính năng đặc biệt:*
        *   Nhấp biểu tượng bảng màu 🎨 ở đầu trang để đổi màu nền note (Rose, Mint, Lavender, Sky...).
        *   Nhấp biểu tượng mặt cười 😊 để dán các Sticker dễ thương nổi trên đầu note.
        *   Nhấp tab **Sketchpad** để mở bảng vẽ tay Canvas, vẽ nguệch ngoạc hoặc phác thảo trực tiếp và tự động lưu lại!
*   **Knowledge (Quản lý Tri thức - Obsidian Style):**
    *   Giao diện Dark academia, font chữ lập trình chuyên nghiệp.
    *   *Tính năng đặc biệt:* Hỗ trợ liên kết chéo hai chiều (Wiki Links) và xem danh sách các liên kết ngược (Backlinks) dưới chân trang.

---

## 🏷️ 2. Hệ Thống Tags Tự Động
Chỉ cần gõ hashtag bất kỳ trong ghi chú của bạn, ví dụ: #huongdan #note #trainghiem.
*   Ứng dụng sẽ tự động phát hiện, lọc ra các hashtag và hiển thị thành danh sách lọc ở thanh bên trái.
*   Click vào các tag ở sidebar để lọc nhanh những ghi chú có chứa tag đó!

---

## 🔗 3. Liên kết Wiki Link & Liên kết ngược
NoteSpace hỗ trợ liên kết các ghi chú với nhau tương tự Obsidian hay Roam Research bằng cách bao tiêu đề note trong hai dấu ngoặc vuông.
*   Hãy thử nhấp vào liên kết sau để mở note giới thiệu giao diện: [[Giao diện và Phong cách]]
*   Hoặc nhấp vào liên kết này để tìm hiểu thêm về liên kết ngược: [[Liên kết và Liên kết ngược]]
*   *Tính năng tạo tự động:* Nếu bạn tạo một liên kết tới một note chưa tồn tại, ví dụ: [[Ý tưởng mới]], và click vào đó, NoteSpace sẽ tự động tạo mới note đó cho bạn!

Chúc bạn có những trải nghiệm ghi chú tuyệt vời cùng NoteSpace!`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["huongdan", "note", "trainghiem"]
  },
  {
    id: "guide-2",
    title: "Giao diện và Phong cách",
    content: `# Giao diện và Phong cách trong NoteSpace

NoteSpace được thiết kế để phục vụ nhiều sở thích khác nhau của người dùng thông qua 3 chế độ giao diện linh hoạt:

## 1. Minimalist Mode #toigian #focus
*   Giao diện tinh giản tối đa với gam màu xám/zinc thời thượng.
*   Giúp loại bỏ mọi yếu tố gây nhiễu để bạn tập trung hoàn toàn vào câu từ.
*   *Mẹo:* Sử dụng phím tắt Focus Mode để tối đa hóa không gian viết của bạn.

## 2. Youthful Mode #vui #sticker #ve
*   Phù hợp cho ghi chép hàng ngày, nhật ký hoặc scrapbooking kỹ thuật số.
*   **Trang trí trang:** Bạn có thể lựa chọn 6 màu nền pastel dịu nhẹ khác nhau và ghim các sticker emoji xinh xắn.
*   **Canvas Sketchpad:** Tab vẽ tay cho phép bạn phác thảo ý tưởng, vẽ đồ thị minh họa hoặc ghi chú nhanh bằng tay vô cùng trực quan.

Quay lại trang chính: [[🚀 Hướng Dẫn Sử Dụng NoteSpace]]`,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    tags: ["toigian", "focus", "vui", "sticker", "ve"]
  },
  {
    id: "guide-3",
    title: "Liên kết và Liên kết ngược",
    content: `# Liên kết và Liên kết ngược (Wiki Links & Backlinks)

Chào mừng bạn đến với chế độ **Knowledge Management** chuyên sâu! Đây là phong cách quản lý tri thức dạng mạng lưới (networked thought).

## 1. Liên kết Hai Chiều (Bi-directional Links) #lienket #wiki
Bằng cách gõ \`[[Tiêu đề Note]]\`, bạn tạo ra một mối liên kết chặt chẽ giữa các ghi chú.
*   **Định vị nhanh:** Nhấp vào liên kết sẽ đưa bạn thẳng đến note đích.
*   **Backlinks:** Ở cuối mỗi ghi chú, NoteSpace hiển thị danh sách tất cả các note khác đang liên kết tới note hiện tại (Backlinks). Điều này giúp bạn dễ dàng tìm lại ngữ cảnh liên quan.

Ví dụ: Note này đang được liên kết từ trang [[🚀 Hướng Dẫn Sử Dụng NoteSpace]]. Bạn có thể kiểm tra danh sách Backlinks bên dưới chân trang và click vào để quay lại!`,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    tags: ["lienket", "wiki", "backlinks"]
  }
];

export const useNotesStore = create<NotesStoreState>()(
  persist(
    (set) => ({
      notes: DEFAULT_NOTES,
      activeNoteId: "guide-1",
      styleMode: "minimalist",
      searchQuery: "",
      selectedTag: null,
      isFocusMode: false,

      setStyleMode: (mode: StyleMode) => set({ styleMode: mode }),
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setSelectedTag: (tag: string | null) => set({ selectedTag: tag }),
      setFocusMode: (focused: boolean) => set({ isFocusMode: focused }),

      createNote: (title?: string, content?: string) => {
        const newNote: Note = {
          id: generateUUID(),
          title: title || "Untitled",
          content: content || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: content ? extractTags(content) : [],
          pageColor: undefined,
          stickers: [],
          doodleData: undefined
        };
        set(state => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id
        }));
      },

      selectNote: (id: string) => set({ activeNoteId: id }),

      updateNote: (id: string, patch: Partial<Note>) => {
        set(state => ({
          notes: state.notes.map(note => {
            if (note.id === id) {
              const updatedNote = { ...note, ...patch };

              // Extract tags on content update
              if (patch.content !== undefined) {
                updatedNote.tags = extractTags(patch.content);
                
                // Only auto-derive title if the current title is "Untitled", empty,
                // or matches the first line of the previous content.
                const currentTitle = note.title;
                const oldDerivedTitle = getNoteTitle({ content: note.content });
                const isAutoDerived = 
                  currentTitle === "Untitled" || 
                  currentTitle === "" || 
                  currentTitle === oldDerivedTitle;

                if (isAutoDerived && patch.title === undefined) {
                  updatedNote.title = getNoteTitle({ content: patch.content });
                }
              }

              if (patch.title !== undefined) {
                updatedNote.title = patch.title;
              }

              updatedNote.updatedAt = new Date().toISOString();
              return updatedNote;
            }
            return note;
          })
        }));
      },

      deleteNote: (id: string) => {
        set(state => {
          const nextNotes = state.notes.filter(note => note.id !== id);
          let nextActiveId = state.activeNoteId;
          
          if (state.activeNoteId === id) {
            nextActiveId = nextNotes.length > 0 ? nextNotes[0].id : null;
          }

          return {
            notes: nextNotes,
            activeNoteId: nextActiveId
          };
        });
      },

      addSticker: (noteId: string, sticker: string) => {
        set(state => ({
          notes: state.notes.map(note => {
            if (note.id === noteId) {
              const stickers = note.stickers || [];
              return {
                ...note,
                stickers: [...stickers, sticker],
                updatedAt: new Date().toISOString()
              };
            }
            return note;
          })
        }));
      },

      removeSticker: (noteId: string, stickerIndex: number) => {
        set(state => ({
          notes: state.notes.map(note => {
            if (note.id === noteId) {
              const stickers = note.stickers || [];
              return {
                ...note,
                stickers: stickers.filter((_, i) => i !== stickerIndex),
                updatedAt: new Date().toISOString()
              };
            }
            return note;
          })
        }));
      },

      updateDoodle: (noteId: string, doodleData: string) => {
        set(state => ({
          notes: state.notes.map(note => {
            if (note.id === noteId) {
              return {
                ...note,
                doodleData,
                updatedAt: new Date().toISOString()
              };
            }
            return note;
          })
        }));
      }
    }),
    {
      name: "notes-app-storage",
      // Restrict persisted keys to notes list, selected active note, and selected style mode
      partialize: state => ({
        notes: state.notes,
        activeNoteId: state.activeNoteId,
        styleMode: state.styleMode
      })
    }
  )
);
