SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Tabelas base
-- ------------------------------------------------------------

CREATE TABLE tb_genero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE tb_nacionalidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE tb_tipo_redes_sociais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE tb_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE tb_genero_musical (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE tb_foto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    foto VARCHAR(255) NOT NULL
);

-- ------------------------------------------------------------
-- Endereço (COM LAT/LONG)
-- ------------------------------------------------------------

CREATE TABLE tb_endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(10),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    CHECK (latitude BETWEEN -90 AND 90),
    CHECK (longitude BETWEEN -180 AND 180)
);

-- ------------------------------------------------------------
-- Usuário
-- ------------------------------------------------------------

CREATE TABLE tb_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(20),
    data_nasc DATE,
    nacionalidade_id INT,
    endereco_id INT,
    sexo_id INT,
    criado DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao DATETIME,

    FOREIGN KEY (nacionalidade_id) REFERENCES tb_nacionalidade(id),
    FOREIGN KEY (endereco_id) REFERENCES tb_endereco(id),
    FOREIGN KEY (sexo_id) REFERENCES tb_sexo(id)
);

-- ------------------------------------------------------------
-- Usuário × Foto
-- ------------------------------------------------------------

CREATE TABLE tb_usuario_foto (
    foto_id INT,
    usuario_id INT,
    PRIMARY KEY (foto_id, usuario_id),

    FOREIGN KEY (foto_id) REFERENCES tb_foto(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Redes sociais
-- ------------------------------------------------------------

CREATE TABLE tb_redes_sociais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link VARCHAR(255) NOT NULL,
    tipo_id INT NOT NULL,
    usuario_id INT NOT NULL,

    FOREIGN KEY (tipo_id) REFERENCES tb_tipo_redes_sociais(id),
    FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Artista
-- ------------------------------------------------------------

CREATE TABLE tb_artista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_artistico VARCHAR(150) NOT NULL,
    usuario_id INT UNIQUE,
    descricao TEXT,

    FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Organizador
-- ------------------------------------------------------------

CREATE TABLE tb_organizador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE,

    FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Evento
-- ------------------------------------------------------------

CREATE TABLE tb_evento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    local VARCHAR(255),
    data DATE NOT NULL,
    hora_inicio TIME,
    hora_fim TIME,
    endereco_id INT,

    FOREIGN KEY (endereco_id) REFERENCES tb_endereco(id)
);

-- ------------------------------------------------------------
-- Evento × Organizador
-- ------------------------------------------------------------

CREATE TABLE tb_evento_organizador (
    evento_id INT,
    organizador_id INT,
    criado DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (evento_id, organizador_id),

    FOREIGN KEY (evento_id) REFERENCES tb_evento(id) ON DELETE CASCADE,
    FOREIGN KEY (organizador_id) REFERENCES tb_organizador(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Evento × Foto
-- ------------------------------------------------------------

CREATE TABLE tb_evento_foto (
    foto_id INT,
    evento_id INT,
    PRIMARY KEY (foto_id, evento_id),

    FOREIGN KEY (foto_id) REFERENCES tb_foto(id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES tb_evento(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Artista × Gênero
-- ------------------------------------------------------------

CREATE TABLE tb_artista_genero (
    genero_id INT,
    artista_id INT,
    PRIMARY KEY (genero_id, artista_id),

    FOREIGN KEY (genero_id) REFERENCES tb_genero(id),
    FOREIGN KEY (artista_id) REFERENCES tb_artista(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Evento × Artista
-- ------------------------------------------------------------

CREATE TABLE tb_evento_artista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artista_id INT NOT NULL,
    evento_id INT NOT NULL,

    cache_esperado DECIMAL(10,2),
    cache_ofertado DECIMAL(10,2),
    cache_final DECIMAL(10,2),
    contra_proposta DECIMAL(10,2),

    sobre_artista TEXT,
    motivo_inscricao TEXT,

    UNIQUE (artista_id, evento_id),

    FOREIGN KEY (artista_id) REFERENCES tb_artista(id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES tb_evento(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Histórico de status do artista no evento
-- ------------------------------------------------------------

CREATE TABLE tb_evento_artista_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_artista_id INT NOT NULL,
    status_id INT NOT NULL,
    data_hora DATETIME NOT NULL,

    FOREIGN KEY (evento_artista_id) REFERENCES tb_evento_artista(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES tb_status(id)
);

-- ------------------------------------------------------------
-- Status do evento
-- ------------------------------------------------------------

CREATE TABLE tb_evento_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    status_id INT NOT NULL,
    data_hora DATETIME NOT NULL,

    FOREIGN KEY (evento_id) REFERENCES tb_evento(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES tb_status(id)
);

-- ------------------------------------------------------------
-- Avaliação de evento
-- ------------------------------------------------------------

CREATE TABLE tb_avaliacao_evento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_estrelas INT NOT NULL,
    usuario_id INT NOT NULL,
    evento_id INT NOT NULL,
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    CHECK (numero_estrelas BETWEEN 1 AND 5),
    UNIQUE (usuario_id, evento_id),

    FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES tb_evento(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Avaliação de artista
-- ------------------------------------------------------------

CREATE TABLE tb_avaliacao_artista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_estrelas INT NOT NULL,
    usuario_id INT NOT NULL,
    artista_id INT NOT NULL,
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    CHECK (numero_estrelas BETWEEN 1 AND 5),
    UNIQUE (usuario_id, artista_id),

    FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (artista_id) REFERENCES tb_artista(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;