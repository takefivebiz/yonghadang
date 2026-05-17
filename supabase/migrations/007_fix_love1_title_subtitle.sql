-- 007: love-1 title / subtitle를 코드 source of truth와 동기화
-- DB가 수동 삽입으로 생성되어 migration 002의 값과 불일치 상태였음
UPDATE contents
SET    title    = '이 사람, ' || chr(10) || ' 저를 좋아하는 걸까요?',
       subtitle = '사소한 반응에도 마음이 흔들려요',
       updated_at = now()
WHERE  slug = 'love-1';
