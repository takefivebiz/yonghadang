-- 006: love-1 thumbnail_url 수정
-- 002 seed에서 thumbnail_url이 null로 삽입됨. 실제 이미지 경로로 갱신한다.
UPDATE contents
SET    thumbnail_url = '/img/love-1.png',
       updated_at    = now()
WHERE  slug = 'love-1';
