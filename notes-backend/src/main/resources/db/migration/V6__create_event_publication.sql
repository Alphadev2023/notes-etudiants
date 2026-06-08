CREATE TABLE IF NOT EXISTS event_publication (
                                                 id               UUID        NOT NULL PRIMARY KEY,
                                                 listener_id      TEXT        NOT NULL,
                                                 event_type       TEXT        NOT NULL,
                                                 serialized_event TEXT        NOT NULL,
                                                 publication_date TIMESTAMP   NOT NULL,
                                                 completion_date  TIMESTAMP
);