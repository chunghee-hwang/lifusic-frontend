import useCheckRole from '@/hooks/check-role';
import { Container } from '@/styles/global-style';
import {
  TextField as TF,
  Stack,
  InputLabel,
  Button,
  Alert,
} from '@mui/material';
import { LoadingButton as LBtn } from '@mui/lab';
import { styled } from 'styled-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';

import FileUtil from '@/utils/file';
import useAddMusicMutation from '@/hooks/admin-api-hooks/add-music-mutation';
import { AddMusicRequest } from '@/constants/types/types';
import useSubscribeAddMusicDone from '@/hooks/admin-api-hooks/subscribe-add-music-done';
import { useRouter } from 'next/router';
import pages from '@/constants/pages';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TextField = styled(TF)`
  width: 20rem;
  & + & {
    margin-top: 1rem !important;
  }
`;

const LoadingButton = styled(LBtn)`
  width: 100%;
  margin-top: 2rem !important;
`;

const ThumbnailImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 9.5rem;
  font-size: 0.5rem;
`;

const ThumbnailImage = styled.img`
  width: 150px;
  min-height: 150px;
  border: 1px solid lightgrey;
`;

export default function AddMusicPage() {
  useCheckRole();
  const router = useRouter();
  const {
    watch,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddMusicRequest>({ mode: 'onChange' });

  const {
    mutate: addMusicMutate,
    isSuccess: isAddMusicInQue,
    isError: isAddMusicError,
    isLoading: isBeforeInQue,
  } = useAddMusicMutation();

  const onSubmit: SubmitHandler<AddMusicRequest> = (data) => {
    addMusicMutate({
      musicName: data.musicName,
      musicFile: data.musicFile[0],
      thumbnailImageFile: resizedThumbnailImageFile || null,
    });
  };

  const { isDone: isAddMusicDone } = useSubscribeAddMusicDone();

  useEffect(() => {
    if (isAddMusicDone) {
      setTimeout(() => {
        router.replace(pages.MUSIC_ADMIN_CONSOLE_PAGE.URL);
      }, 5000);
    }
  }, [isAddMusicDone]);

  const thumbnailImageFile = watch('thumbnailImageFile');
  const [resizedThumbnailImageFile, setResizedThumbnailImageFile] =
    useState<File | null>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>();

  useEffect(() => {
    if (
      !!thumbnailImageFile?.[0] &&
      thumbnailImageFile[0].type.startsWith('image/')
    ) {
      FileUtil.resizeImage(thumbnailImageFile[0], 150, 150, (file) => {
        setResizedThumbnailImageFile(file);
      });
    } else {
      setResizedThumbnailImageFile(null);
    }
  }, [errors, thumbnailImageFile]);

  useEffect(() => {
    const reader = new FileReader();
    const onLoadImage = () => {
      if (typeof reader.result === 'string') {
        setImagePreviewSrc(reader.result);
      }
    };
    if (resizedThumbnailImageFile && typeof window !== 'undefined') {
      reader.readAsDataURL(resizedThumbnailImageFile);
      reader.addEventListener('load', onLoadImage);
    } else if (!resizedThumbnailImageFile) {
      setImagePreviewSrc('');
    }
    return () => {
      reader.removeEventListener('load', onLoadImage);
    };
  }, [resizedThumbnailImageFile]);

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row">
          <InputLabel htmlFor="upload-thumbnail-file">
            <ThumbnailImageContainer>
              <ThumbnailImage
                src={imagePreviewSrc}
                alt="썸네일 이미지"
                width="150px"
                height="auto"
              />
              <Button variant="outlined" component="span" color="secondary">
                업로드
              </Button>
              <input
                id="upload-thumbnail-file"
                hidden
                accept="image/*"
                type="file"
                {...register('thumbnailImageFile', {
                  validate: (value) => {
                    if (!value?.[0]) {
                      return true;
                    }
                    return !!value?.[0]?.type?.startsWith('image/');
                  },
                })}
              />
              {errors.thumbnailImageFile &&
                '이미지 형식의 파일을 업로드해주세요.'}
            </ThumbnailImageContainer>
          </InputLabel>

          <Stack
            direction="column"
            alignItems="flex-start"
            justifyContent="center"
            spacing={2}
            marginLeft={2}
          >
            <TextField
              type="text"
              label="곡명"
              required
              {...register('musicName', {
                required: true,
                minLength: 1,
              })}
              error={!!errors?.musicName}
              helperText={errors?.musicName && '곡명을 입력해주세요'}
              InputLabelProps={{ shrink: true }}
            />
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              marginTop={2}
            >
              <TextField
                label="음악 파일"
                required
                value={watch('musicFile')?.[0]?.name || '필수 항목'}
                disabled
                error={!!errors?.musicFile}
                helperText={errors?.musicFile && '음악 파일을 업로드해주세요.'}
                InputLabelProps={{ shrink: true }}
              />
              <InputLabel htmlFor="upload-music-file">
                <Button variant="outlined" component="span" color="secondary">
                  업로드
                </Button>
                <input
                  id="upload-music-file"
                  hidden
                  accept="audio/*"
                  type="file"
                  {...register('musicFile', {
                    validate: (value) => {
                      return !!value?.[0]?.type?.startsWith('audio/');
                    },
                  })}
                />
              </InputLabel>
            </Stack>
          </Stack>
        </Stack>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isBeforeInQue || isAddMusicInQue}
        >
          음악 등록
        </LoadingButton>
        <Stack direction="column" marginTop={1}>
          {isAddMusicError && (
            <Alert severity="error">음악 등록에 실패하였습니다.</Alert>
          )}
          {isBeforeInQue && (
            <Alert severity="warning">
              음악 등록 요청중입니다. 보고계시는 브라우저를 끄지 마세요.
            </Alert>
          )}
          {!isAddMusicDone && isAddMusicInQue && (
            <Alert severity="warning">
              음악 등록 요청이 완료되었습니다. 브라우저를 닫아도 됩니다.
            </Alert>
          )}
          {isAddMusicDone && (
            <Alert severity="success">
              음악 등록에 성공하였습니다. 잠시 후 음악 관리 페이지로 이동합니다.
            </Alert>
          )}
        </Stack>
      </Form>
    </Container>
  );
}
